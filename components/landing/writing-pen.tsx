"use client";

import { useEffect, useMemo, useRef, type CSSProperties } from "react";
import { useInkSeed } from "@/registry/ballpoint/hooks/use-ink-box";
import { createRng, handCurve, hatchStrokes } from "@/registry/ballpoint/lib/ink-sketch";

type P = readonly [number, number];

// ─── The pen ────────────────────────────────────────────────────────────
// A stick ballpoint drawn in its own ink: laid along +x with the ball at the
// origin, then turned up to the angle a right hand holds it at. Units are
// hundredths of an em of its `size`, so it's three ems long.

const TILT = -54;
const R = { tip: 3.8, nose: 9.8, cap: 11.8 };

function penArt(seed: number) {
  const r = createRng(seed);
  const wob = () => (r() - 0.5) * 0.8;
  // A long edge, pulled through a few points so it never looks ruled.
  const edge = (x0: number, y0: number, x1: number, y1: number) => {
    const n = Math.max(2, Math.round(Math.abs(x1 - x0) / 40));
    const pts: P[] = [];
    for (let i = 0; i <= n; i++) pts.push([x0 + ((x1 - x0) * i) / n, y0 + ((y1 - y0) * i) / n + (i && i < n ? wob() : 0)]);
    return handCurve(seed + Math.round(x0 * 7 + y0 * 13), pts, { jitter: 0.35 });
  };
  const ring = (x: number, rad: number) => handCurve(seed + x, [[x - 0.6, -rad], [x + 0.7, 0], [x - 0.4, rad]], { jitter: 0.2 });

  const outline = [
    // The brass tip and the plastic nose it sits in.
    edge(1.4, -1.1, 11, -R.tip),
    edge(1.4, 1.1, 11, R.tip),
    ring(11, R.tip),
    edge(11, -R.tip, 36, -R.nose),
    edge(11, R.tip, 36, R.nose),
    ring(36, R.nose),
    // The six-sided barrel, one face lit.
    edge(36, -R.nose, 216, -R.nose),
    edge(36, R.nose, 216, R.nose),
    edge(40, -3.6, 214, -3.8),
    // The cap pushed on the back, its clip standing off it.
    edge(214, -R.cap, 290, -R.cap),
    edge(214, R.cap, 290, R.cap),
    ring(214, R.cap),
    handCurve(seed + 3, [[290, -R.cap], [295.5, -5], [296.5, 4], [290, R.cap]], { jitter: 0.25 }),
    handCurve(seed + 4, [[289, -R.cap], [291, -R.cap - 5], [262, -R.cap - 5.4], [228, -R.cap - 5.2], [223.5, -R.cap - 2.6]], { jitter: 0.3 }),
  ];
  // The refill seen through the clear barrel: a thin tube, inked to here.
  const tube = [edge(18, -2.1, 222, -2.1), edge(18, 2.1, 222, 2.1)];
  const ink = `M18 -2.1L${172 + r() * 10} -2.1L${172 + r() * 10} 2.1L18 2.1Z`;
  // Shade under the barrel, and the cap coloured in.
  const shade = hatchStrokes(seed + 5, 170, R.nose - 4, { gap: 4.6, angle: -62, jitter: 0.4 }).map((d) => ({ d, at: [42, 3.8] as P }));
  const cap = hatchStrokes(seed + 6, 72, 2 * R.cap - 1.4, { gap: 2.4, angle: -58, jitter: 0.3 }).map((d) => ({ d, at: [216, -R.cap + 0.7] as P }));
  const body = `M0 -1L11 -${R.tip}L36 -${R.nose}L214 -${R.nose}L214 -${R.cap}L292 -${R.cap}Q297 0 292 ${R.cap}L214 ${R.cap}L214 ${R.nose}L36 ${R.nose}L11 ${R.tip}L0 1Z`;
  return { outline, tube, ink, shade, cap, body };
}

// The drawing's box once turned: the corners of the pen's own box, rotated.
const VIEW = (() => {
  const [c, s] = [Math.cos((TILT * Math.PI) / 180), Math.sin((TILT * Math.PI) / 180)];
  const pts = [[-2, -19], [298, -19], [298, 14], [-2, 14]].map(([x, y]) => [x * c - y * s, x * s + y * c]);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [x0, y0] = [Math.min(...xs) - 4, Math.min(...ys) - 4];
  return [x0, y0, Math.max(...xs) + 16 - x0, Math.max(...ys) + 16 - y0] as const;
})();

// ─── The writing ───────────────────────────────────────────────────────
// Every word and control in the drawing carries its beat (data-pen-at,
// data-pen-d: see launch-card.tsx). The pen visits them in order: along each
// word level with the soft edge that writes it in (.ink-write's mask),
// round each control while its box is drawn, and lifted in between.

const easeWrite = bezier(0.37, 0, 0.63, 1);

function bezier(x1: number, y1: number, x2: number, y2: number) {
  const at = (a: number, b: number, t: number) => 3 * a * t * (1 - t) ** 2 + 3 * b * t * t * (1 - t) + t ** 3;
  return (x: number) => {
    let [lo, hi] = [0, 1];
    for (let i = 0; i < 24; i++) {
      const mid = (lo + hi) / 2;
      if (at(x1, x2, mid) < x) lo = mid;
      else hi = mid;
    }
    return at(y1, y2, (lo + hi) / 2);
  };
}

type Frame = { t: number; x: number; y: number; lift: number; turn: number; o?: number };

function plan(line: HTMLElement, em: number): { frames: Frame[]; end: number } | null {
  const box = line.getBoundingClientRect();
  const marks = [...line.querySelectorAll<HTMLElement>("[data-pen-at]")]
    .map((el) => ({
      el,
      at: +el.dataset.penAt!,
      d: +el.dataset.penD!,
      word: el.classList.contains("ink-write"),
      // A line is given in the px of the drawing it belongs to.
      line: el.dataset.penLine?.split(" ").map(Number),
      // A control can name the part the pen goes round (a checkbox in its row).
      rect: (el instanceof SVGElement && el.ownerSVGElement ? el.ownerSVGElement : el.dataset.penBox ? (el.querySelector(el.dataset.penBox) ?? el) : el).getBoundingClientRect(),
    }))
    .filter((m) => m.rect.width > 0)
    .sort((a, b) => a.at - b.at);
  if (!marks.length) return null;

  const frames: Frame[] = [];
  const rel = (x: number, y: number) => [x - box.left, y - box.top] as const;
  let last: Frame | null = null;
  const put = (f: Frame) => {
    if (last && f.t <= last.t) f.t = last.t + 1;
    frames.push(f);
    last = f;
  };

  for (const m of marks) {
    const { rect } = m;
    if (m.line) {
      // A pull from one point to another, bowed a little on the way.
      const [x0, y0, x1, y1] = m.line;
      const [ax, ay] = rel(rect.left + x0, rect.top + y0);
      const [bx, by] = rel(rect.left + x1, rect.top + y1);
      if (last) put({ t: m.at - 80, x: ax, y: ay - 0.25 * em, lift: 1, turn: 2 });
      put({ t: m.at, x: ax, y: ay, lift: 0, turn: 0 });
      put({ t: m.at + m.d * 0.5, x: (ax + bx) / 2 - 0.04 * em, y: (ay + by) / 2 + 0.08 * em, lift: 0, turn: -1 });
      put({ t: m.at + m.d, x: bx, y: by, lift: 0, turn: 1 });
    } else if (m.word) {
      // Letters sit between the baseline and the x-height; the pen bobs
      // between them, a beat per letter, as the edge passes.
      const text = m.el.textContent ?? "";
      const [x0, x1] = [rect.left + 0.12 * em, rect.right - 0.3 * em];
      const [low, high] = [rect.top + rect.height * 0.8, rect.top + rect.height * 0.5];
      const steps = Math.max(2, text.length * 2);
      // Touch down where the word starts, just ahead of the edge.
      const [sx, sy] = rel(x0, low);
      if (last) put({ t: m.at - 70, x: sx - 0.1 * em, y: sy - 0.32 * em, lift: 1, turn: 2 });
      for (let i = 0; i <= steps; i++) {
        const u = (i / steps) * 0.8;
        const edgeX = rect.left + rect.width * (1.3 * easeWrite(u) - 0.09);
        const x = Math.min(x1, Math.max(x0, edgeX));
        const [px, py] = rel(x, i % 2 ? high : low);
        put({ t: m.at + m.d * u, x: px, y: py, lift: 0, turn: i % 2 ? -1.5 : 1 });
        if (x >= x1) break;
      }
    } else {
      // A control: round its box while the pen draws it.
      const pad = 0.04 * em;
      const corners: [number, number][] = [
        [rect.left - pad, rect.top - pad],
        [rect.right + pad, rect.top - pad],
        [rect.right + pad, rect.bottom + pad],
        [rect.left - pad, rect.bottom + pad],
        [rect.left - pad, rect.top],
      ];
      const [cx, cy] = rel(...corners[0]);
      if (last) put({ t: m.at - 60, x: cx, y: cy - 0.3 * em, lift: 1, turn: 2 });
      corners.forEach((c, i) => {
        const [x, y] = rel(...c);
        put({ t: m.at + (m.d * i) / (corners.length - 1), x, y, lift: 0, turn: i % 2 ? -1 : 1.5 });
      });
    }
  }
  return { frames, end: frames[frames.length - 1].t };
}

/** Where the pen lies once it's put down: px from the top left of the drawing it's in, and how far it's turned. */
export type PenRest = { x: number; y: number; turn: number };

/**
 * The pen that draws the front page's card. It comes in as the first mark
 * starts, follows the drawing mark by mark (along each word, level with
 * the soft edge that writes it in, and round each control while its box is
 * drawn), then puts itself down on the sheet at `rest`. Synced to the CSS
 * that draws the marks, so it joins in step however late the page's
 * scripts arrive. A new `take` (the card drawn again) picks it back up
 * from where it lies. `size` is its scale: it's three times that long.
 */
export function WritingPen({
  seed = "stage-pen",
  size,
  take = 0,
  rest,
}: {
  seed?: string;
  size: number;
  take?: number;
  rest: (w: number, h: number) => PenRest;
}) {
  const s = useInkSeed(seed);
  const art = useMemo(() => penArt(s), [s]);
  const ref = useRef<HTMLSpanElement>(null);
  // Read when the pen moves, not a reason to plan it again.
  const restAt = useRef(rest);
  useEffect(() => {
    restAt.current = rest;
  });

  useEffect(() => {
    const pen = ref.current;
    const line = pen?.parentElement;
    if (!pen || !line) return;
    let anim: Animation | undefined;
    let stopped = false;

    // Lying still where it was put down: with reduced motion, and once the
    // drawing's done and the sheet changes size under it.
    const lie = () => {
      anim?.cancel();
      anim = undefined;
      const r = restAt.current(line.clientWidth, line.clientHeight);
      pen.style.setProperty("--pen-x", `${r.x}px`);
      pen.style.setProperty("--pen-y", `${r.y}px`);
      pen.style.setProperty("--pen-turn", `${r.turn}deg`);
      pen.style.opacity = "1";
    };
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return lie();

    const run = () => {
      if (stopped) return;
      // The first word's own animation is the clock the whole drawing runs on.
      const clock = [...line.querySelectorAll<HTMLElement>(".ink-write[data-pen-at]")]
        .flatMap((el) => el.getAnimations())
        .find((a) => a instanceof CSSAnimation && a.animationName === "ink-write");
      if (!clock) return void (anim ? undefined : lie());
      if (clock.startTime == null) return void clock.ready.then(run);
      const p = plan(line, size);
      if (!p) return;
      const { frames, end } = p;
      const r = restAt.current(line.clientWidth, line.clientHeight);
      const total = end + 1100;
      const first = frames[0];
      const lastF = frames[frames.length - 1];
      const keys: Frame[] = [
        // Picked up from the sheet, or brought in from above it the first time.
        take ? { t: 0, x: r.x, y: r.y, lift: 0, turn: r.turn, o: 1 } : { t: 0, x: first.x + 0.5 * size, y: first.y - 0.9 * size, lift: 1, turn: 6, o: 0 },
        { t: Math.max(1, first.t - 40), x: first.x, y: first.y - 0.2 * size, lift: 1, turn: 2, o: 1 },
        ...frames,
        { t: end + 220, x: lastF.x + 0.3 * size, y: lastF.y - 0.5 * size, lift: 1, turn: 4, o: 1 },
        { t: total, x: r.x, y: r.y, lift: 0, turn: r.turn, o: 1 },
      ];
      // Moved by custom properties rather than transform, so the pen runs on
      // the same thread as the marks: when a busy phone holds the drawing
      // back, it holds the pen back with it instead of letting it run on.
      const keyframes: Keyframe[] = keys.map((k, i) => ({
        offset: Math.min(1, k.t / total),
        "--pen-x": `${k.x.toFixed(1)}px`,
        "--pen-y": `${k.y.toFixed(1)}px`,
        "--pen-turn": `${k.turn}deg`,
        "--pen-lift": k.lift,
        opacity: k.o ?? 1,
        // Out to its first mark quickly, and put down gently at the end.
        easing: i === 0 ? "cubic-bezier(0.3, 0, 0.2, 1)" : i === keys.length - 2 ? "cubic-bezier(0.45, 0, 0.2, 1)" : "linear",
      }));
      anim?.cancel();
      anim = pen.animate(keyframes, { duration: total, fill: "both" });
      anim.startTime = clock.startTime;
    };

    // Measure once the hand's font is in, and again if the sheet reflows.
    document.fonts.ready.then(run);
    const observer = new ResizeObserver(() => (anim?.playState === "running" ? run() : anim || pen.style.opacity ? lie() : undefined));
    observer.observe(line);
    return () => {
      stopped = true;
      observer.disconnect();
      anim?.cancel();
    };
  }, [s, size, take]);

  const [vx, vy, vw, vh] = VIEW;
  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="writing-pen pointer-events-none absolute top-0 left-0 z-10 block size-0 opacity-0"
      style={{ fontSize: size } as CSSProperties}
    >
      <svg
        viewBox={VIEW.join(" ")}
        className="ink-sketch absolute overflow-visible text-ink"
        style={{ left: `${vx / 100}em`, top: `${vy / 100}em`, width: `${vw / 100}em`, height: `${vh / 100}em` } as CSSProperties}
      >
        {/* Its shadow on the page, a little below and to the right. */}
        <g transform={`translate(9 13) rotate(${TILT})`} className="text-ink-5">
          <path d={art.body} style={{ fill: "currentColor", stroke: "none" }} opacity={0.55} />
        </g>
        <g transform={`rotate(${TILT})`}>
          <path d={art.body} style={{ fill: "var(--paper)", stroke: "none" }} opacity={0.94} />
          <path d={art.ink} className="ink-fill" style={{ "--ink-fill": 0.85 } as CSSProperties} />
          {art.tube.map((d, i) => (
            <path key={`t${i}`} d={d} style={{ "--ink-w": 1.1 } as CSSProperties} />
          ))}
          {art.shade.map(({ d, at }, i) => (
            <path key={`s${i}`} d={d} transform={`translate(${at[0]} ${at[1]})`} style={{ "--ink-w": 0.9 } as CSSProperties} opacity={0.7} />
          ))}
          {art.cap.map(({ d, at }, i) => (
            <path key={`c${i}`} d={d} transform={`translate(${at[0]} ${at[1]})`} style={{ "--ink-w": 1.3 } as CSSProperties} />
          ))}
          {art.outline.map((d, i) => (
            <path key={`o${i}`} d={d} style={{ "--ink-w": 1.9 } as CSSProperties} />
          ))}
          <circle cx={0.3} cy={0} r={1.5} style={{ fill: "currentColor", stroke: "none" }} />
        </g>
      </svg>
    </span>
  );
}
