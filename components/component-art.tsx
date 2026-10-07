"use client";

import { useCallback } from "react";
import { useInkBox } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { shiftPath } from "@/registry/ballpoint/lib/ink-glyphs";
import {
  createRng,
  dotStroke,
  handCurve,
  hashSeed,
  hatchStrokes,
  lineStroke,
  ringStroke,
  roundedBoxStroke,
  tickStroke,
} from "@/registry/ballpoint/lib/ink-sketch";

// A little drawing of each component for the home page: the component as
// you'd sketch it in a margin, on a 64×44 grid. Strokes are seeded by the
// component's name, so each drawing is the same on the server and in the
// browser, and they draw themselves in, one pen stroke after another, the
// first time they scroll into view (and again when you point at one).

type P = readonly [number, number];

/** A pen for one drawing: every shape it makes gets its own seed. */
function pen(name: string) {
  let i = 0;
  const seed = () => hashSeed(`art-${name}-${i++}`);
  const line = (a: P, b: P, bow = 0.4) => lineStroke(seed(), a, b, { bow, jitter: 0.2 });
  /** Pulls joined without lifting the pen. */
  const poly = (pts: P[]) => {
    let d = "";
    for (let k = 1; k < pts.length; k++) {
      const leg = lineStroke(seed(), pts[k - 1], pts[k], { bow: 0.4, jitter: 0 });
      d += k === 1 ? leg : leg.replace(/^M[^C]*/, "");
    }
    return d;
  };
  const curve = (pts: P[], closed = false) => handCurve(seed(), pts, { jitter: 0.15, closed });
  const box = (x: number, y: number, w: number, h: number, r = 3) => shiftPath(roundedBoxStroke(seed(), w, h, r, { jitter: 0.2, overrun: 0.04 }), x, y);
  const ring = (cx: number, cy: number, d: number, turns = 1.08) => shiftPath(ringStroke(seed(), d, { turns }), cx - d / 2, cy - d / 2);
  const dot = (x: number, y: number, r = 1.2) => shiftPath(dotStroke(seed(), r), x, y);
  const tick = (x: number, y: number, s: number) => shiftPath(tickStroke(seed(), s), x, y);
  const hatch = (x: number, y: number, w: number, h: number, gap = 3.4) => hatchStrokes(seed(), w, h, { gap, angle: -50, jitter: 0.3 }).map((d) => shiftPath(d, x, y));
  /** Handwriting too small to read: a run of low humps. */
  const words = (x: number, y: number, len: number) => {
    const r = createRng(seed());
    const pts: P[] = [];
    for (let px = 0, up = true; px <= len; px += 2.6 + r() * 1.4, up = !up) pts.push([x + px, y + (up ? -1.1 : 1) * (0.6 + r() * 0.8)]);
    return handCurve(seed(), pts, { jitter: 0.1 });
  };
  /** A sine run, for waves and squiggles. */
  const wave = (x0: number, x1: number, y: number, amp: number, swells: number) =>
    curve(Array.from({ length: swells * 4 + 1 }, (_, k) => [x0 + ((x1 - x0) * k) / (swells * 4), y + Math.sin((k / 4) * Math.PI * 2) * amp] as P));
  const chevron = (x: number, y: number, s = 4, dir: "down" | "up" | "right" = "down") =>
    poly(dir === "down" ? [[x - s, y - s / 2], [x, y + s / 2], [x + s, y - s / 2]] : dir === "up" ? [[x - s, y + s / 2], [x, y - s / 2], [x + s, y + s / 2]] : [[x - s / 2, y - s], [x + s / 2, y], [x - s / 2, y + s]]);
  const arc = (cx: number, cy: number, rad: number, a0: number, a1: number, steps = 8): P[] =>
    Array.from({ length: steps + 1 }, (_, k) => {
      const a = ((a0 + ((a1 - a0) * k) / steps) * Math.PI) / 180;
      return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad] as P;
    });
  return { line, poly, curve, box, ring, dot, tick, hatch, words, wave, chevron, arc };
}

const drawings: Record<string, (p: ReturnType<typeof pen>) => string[]> = {
  button: (p) => [p.box(8, 9, 46, 24, 7), p.words(18, 21, 26), ...p.hatch(11, 36, 44, 3, 4.5)],
  input: (p) => [p.box(5, 12, 54, 20, 5), p.line([13, 17], [13.4, 27], 0.2), p.words(19, 22, 20)],
  textarea: (p) => [p.box(7, 5, 50, 34, 4), p.words(14, 14, 28), p.words(14, 22, 34), p.words(14, 30, 16), p.line([50, 36], [54, 32], 0.2), p.line([46, 36], [54, 28], 0.2)],
  label: (p) => [p.words(8, 11, 22), p.box(8, 18, 44, 18, 4), p.line([14, 27], [14.3, 33], 0.2)],
  separator: (p) => [p.words(8, 9, 30), p.line([4, 22], [60, 21.4], 0.8), p.words(8, 35, 24), p.words(40, 35, 12)],
  field: (p) => [p.words(7, 7, 14), p.box(7, 11, 50, 16, 4), p.words(13, 19, 18), p.words(7, 36, 34)],
  checkbox: (p) => [p.box(8, 9, 26, 26, 5), p.tick(13, 14, 17), p.words(40, 22, 18)],
  "radio-group": (p) => [p.ring(14, 13, 14), p.dot(14, 13, 2.8), p.words(26, 13, 26), p.ring(14, 31, 14), p.words(26, 31, 20)],
  switch: (p) => [p.box(6, 11, 52, 22, 11), ...p.hatch(8, 13, 24, 18, 3.6).slice(0, 6), p.ring(45, 22, 16)],
  slider: (p) => [p.line([5, 23], [59, 22.4], 0.5), p.line([5, 21], [36, 20.6], 0.2), p.ring(38, 22, 13), p.dot(38, 22, 1.8)],
  card: (p) => [p.box(7, 4, 50, 36, 4), p.words(14, 13, 22), p.words(14, 20, 32), p.line([14, 26], [50, 26], 0.4), p.box(14, 30, 14, 6, 2), p.words(33, 33, 12)],
  badge: (p) => [p.box(11, 12, 42, 20, 10), p.words(19, 22, 26)],
  avatar: (p) => [p.ring(32, 22, 34), p.ring(32, 17, 11), p.curve([[19, 34], [22, 28], [28, 26], [36, 26], [42, 28], [45, 34]])],
  kbd: (p) => [p.box(13, 7, 38, 28, 6), p.line([24, 15], [24.4, 27], 0.2), p.poly([[39, 15], [29, 21], [40, 27]]), p.line([11, 39], [53, 39.3], 0.5)],
  alert: (p) => [p.box(5, 8, 54, 28, 5), p.ring(16, 22, 12), p.line([16, 18], [16.1, 22.5], 0.1), p.dot(16.1, 25.6, 0.7), p.words(26, 18, 26), p.words(26, 26, 18)],
  skeleton: (p) => [p.ring(14, 15, 14), p.line([26, 12], [52, 12.4], 0.3), p.line([26, 19], [42, 19.2], 0.3), p.line([8, 30], [56, 30.3], 0.3), p.line([8, 37], [40, 37.2], 0.3)],
  progress: (p) => [p.box(5, 14, 54, 16, 8), ...p.hatch(8, 17, 32, 10, 3.6), p.words(24, 38, 14)],
  table: (p) => [p.box(6, 6, 52, 32, 3), p.line([6, 16], [58, 16.2], 0.3), p.line([6, 27], [58, 26.8], 0.3), p.line([26, 6], [26.2, 38], 0.3), p.words(10, 11.4, 10), p.words(30, 11.4, 14)],
  tabs: (p) => [p.poly([[6, 18], [6, 8], [24, 8], [24, 18]]), p.line([24, 18], [58, 18.3], 0.4), p.line([6, 18], [6, 38], 0.3), p.poly([[6, 38], [58, 38], [58, 18]]), p.words(10, 13, 10), p.words(30, 12, 12), p.words(12, 27, 34)],
  accordion: (p) => [p.words(7, 9, 26), p.chevron(54, 9, 3.5, "up"), p.line([5, 16], [59, 16.3], 0.4), p.words(7, 23, 30), p.chevron(54, 23, 3.5), p.line([5, 30], [59, 29.7], 0.4), p.words(7, 37, 22), p.chevron(54, 37, 3.5)],
  dialog: (p) => [p.box(9, 4, 46, 36, 5), p.words(15, 13, 18), p.line([46, 9], [50, 13], 0.1), p.line([50, 9], [46, 13], 0.1), p.words(15, 21, 32), p.box(30, 29, 11, 7, 2), p.box(43, 29, 8, 7, 2)],
  "alert-dialog": (p) => [p.box(8, 4, 48, 36, 5), p.poly([[32, 8], [24, 21], [40, 21], [32, 8]]), p.line([32, 12.5], [32.1, 17.2], 0.1), p.words(14, 27, 36), p.box(14, 31, 15, 6, 2), p.box(33, 31, 17, 6, 2)],
  sheet: (p) => [p.box(5, 4, 54, 36, 3), p.line([34, 4], [34.3, 40], 0.3), p.words(40, 12, 14), p.words(40, 19, 10), p.words(40, 26, 14), p.line([48, 33], [55, 33.2], 0.2), ...p.hatch(7, 6, 24, 32, 5).slice(0, 5)],
  popover: (p) => [p.box(5, 4, 20, 9, 3), p.poly([[8, 17], [14, 17], [16, 13], [18, 17], [58, 17], [58, 40], [8, 40], [8, 17]]), p.words(15, 25, 34), p.words(15, 32, 22)],
  tooltip: (p) => [p.poly([[14, 6], [50, 6], [50, 20], [36, 20], [32, 25], [28, 20], [14, 20], [14, 6]]), p.words(20, 13, 24), p.poly([[30, 30], [30, 41], [33, 38], [36, 42]])],
  "dropdown-menu": (p) => [p.box(6, 4, 30, 10, 4), p.chevron(29, 9, 2.5), p.words(11, 9, 12), p.box(10, 17, 40, 24, 4), p.words(16, 24, 18), p.words(16, 30, 26), p.words(16, 36, 14)],
  select: (p) => [p.box(5, 7, 54, 18, 5), p.words(12, 16, 22), p.chevron(50, 16, 3.5), p.box(5, 28, 54, 12, 3), p.words(12, 34, 16)],
  toast: (p) => [p.box(21, 12, 40, 20, 5), p.ring(31, 22, 9), p.tick(27.6, 18.6, 6.4), p.words(40, 19, 14), p.words(40, 25, 10), p.line([4, 17], [14, 17.2], 0.2), p.line([2, 23], [14, 23.1], 0.2), p.line([6, 29], [14, 29.1], 0.2)],
  "ink-icons": (p) => [p.curve([[16, 4], [18.4, 13], [29, 15.5], [18.4, 18], [16, 30], [13.6, 18], [3, 15.5], [13.6, 13], [16, 4]]), p.curve([[44, 36], [37, 29.4], [34.5, 22.6], [35.6, 17.4], [40, 15.6], [44, 18.4], [48, 15.6], [52.4, 17.4], [53.5, 22.6], [51, 29.4], [44, 36]]), p.line([48, 5], [48.1, 12], 0.2), p.line([44.5, 8.5], [51.5, 8.4], 0.2)],
  annotate: (p) => [p.words(5, 17, 14), p.words(24, 17, 20), p.words(48, 17, 11), p.ring(34, 17, 28, 1.12), p.line([8, 30], [58, 29.2], 0.9), p.line([14, 34], [48, 33.4], 0.8)],
  "section-heading": (p) => [p.line([9, 8], [9.3, 22], 0.2), p.line([22, 8], [21.8, 22], 0.2), p.line([9, 15], [22, 15.2], 0.2), p.line([31, 8], [31.2, 22], 0.2), p.line([28, 8], [34, 7.8], 0.1), p.line([28, 22], [34, 22.2], 0.1), p.curve([[4, 36], [20, 29], [42, 28], [50, 33], [36, 32], [60, 26]])],
  paper: (p) => [p.poly([[9, 4], [43, 4], [55, 16], [55, 40], [9, 40], [9, 4]]), p.poly([[43, 4], [43, 16], [55, 16]]), p.words(15, 14, 22), p.words(15, 22, 34), p.words(15, 29, 30), p.words(15, 36, 14)],
  frame: (p) => [p.box(4, 3, 56, 38, 3), p.box(12, 10, 40, 24, 2), p.line([12, 6.5], [12.2, 10], 0.1), p.line([8, 10.2], [12, 10.2], 0.1), p.line([52, 33.5], [52.2, 37.5], 0.1), p.line([52, 33.8], [56, 33.8], 0.1), p.curve([[17, 28], [25, 20], [31, 25], [37, 17], [47, 28]])],
  "copy-button": (p) => [p.box(5, 13, 31, 26, 4), p.poly([[16, 9], [16, 4], [52, 4], [52, 28], [42, 28]]), p.words(11, 22, 18), p.words(11, 30, 12), p.tick(40, 29, 14)],
  "signature-pad": (p) => [p.box(5, 4, 54, 36, 4), p.curve([[11, 28], [14, 15], [18, 24], [20, 17], [24, 27], [29, 20], [31, 29], [38, 19], [44, 27], [52, 24]]), p.line([11, 33], [53, 33.2], 0.3), p.line([9, 11], [13, 15], 0.1), p.line([13, 11], [9, 15], 0.1)],
  "hatch-grid": (p) => [p.box(5, 5, 54, 34, 3), p.line([23, 5], [23.2, 39], 0.2), p.line([41, 5], [41.2, 39], 0.2), p.line([5, 16.5], [59, 16.2], 0.2), p.line([5, 28], [59, 27.8], 0.2), ...p.hatch(6, 6, 16, 10, 3.2), ...p.hatch(42, 29, 16, 9, 3.2), ...p.hatch(24, 17.5, 16, 10, 3.2)],
  timeline: (p) => [p.line([4, 22], [57, 21.6], 0.4), p.poly([[52, 17], [59, 21.6], [52, 26]]), p.ring(14, 22, 8), p.ring(32, 22, 8), p.dot(32, 22, 1.8), p.ring(50, 22, 8), p.words(8, 10, 14), p.words(26, 35, 14), p.words(44, 10, 12)],
  "ink-theme-toggle": (p) => [p.ring(18, 22, 12), ...Array.from({ length: 8 }, (_, k) => p.line([18 + Math.cos(k * 0.785 + 0.2) * 9, 22 + Math.sin(k * 0.785 + 0.2) * 9], [18 + Math.cos(k * 0.785 + 0.2) * 13, 22 + Math.sin(k * 0.785 + 0.2) * 13], 0.1)), p.curve([...p.arc(47, 22, 11, -55, 235, 10), ...p.arc(52, 17.5, 8.4, 200, 20, 8).slice(1)])],
  "margin-note": (p) => [p.words(5, 9, 28), p.words(5, 16, 24), p.words(5, 23, 30), p.words(5, 30, 20), p.words(5, 37, 26), p.line([39, 4], [39.2, 40], 0.3), p.words(44, 12, 16), p.words(44, 19, 12), p.curve([[43, 28], [38, 30], [34, 26]]), p.poly([[36, 22.6], [33.6, 26.2], [38.4, 27.4]])],
  checklist: (p) => [p.box(6, 5, 9, 9, 2), p.tick(7.4, 5.8, 8), p.words(21, 10, 30), p.box(6, 18, 9, 9, 2), p.tick(7.4, 18.8, 8), p.words(21, 23, 24), p.box(6, 31, 9, 9, 2), p.words(21, 36, 32)],
  redact: (p) => [p.words(5, 11, 50), p.words(5, 21, 18), p.curve([[24, 18], [50, 20], [24, 22], [50, 24], [24, 26], [50, 25]]), ...p.hatch(24, 17, 28, 9, 2.4), p.words(5, 36, 36)],
  scrawl: (p) => [p.curve([[6, 28], [14, 10], [20, 34], [27, 8], [33, 36], [40, 10], [46, 32], [52, 14], [57, 28]]), p.curve([[10, 36], [24, 38], [38, 35], [54, 38]]), p.curve([...p.arc(32, 22, 4, 0, 700, 20).map((q, k) => [32 + (q[0] - 32) * (1 + k * 0.05), 22 + (q[1] - 22) * (1 + k * 0.05)] as P)])],
};

/** Strokes for a component's drawing, memoised: they only depend on the name. */
const cache = new Map<string, string[]>();
function strokesFor(name: string) {
  let strokes = cache.get(name);
  if (!strokes) {
    strokes = (drawings[name] ?? drawings.scrawl)(pen(name));
    cache.set(name, strokes);
  }
  return strokes;
}

/** Whether there is a drawing for this component. */
export const hasArt = (name: string) => name in drawings;

/**
 * A component sketched in the margin. It draws itself in the first time it
 * scrolls into view, and again when you point at it (or tab to it). Sizing
 * is up to the caller (`className`); it takes the text colour.
 */
export function ComponentArt({ name, className }: { name: string; className?: string }) {
  const [ref] = useInkBox([64, 44]);
  const strokes = strokesFor(name);
  // Drawn again on hover: dropping the finished marker restarts the pen.
  const redraw = useCallback((e: React.PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== "mouse") return;
    const svg = e.currentTarget.querySelector("svg");
    const paths = svg?.querySelectorAll("path.ink-draw");
    if (!paths?.length || [...paths].some((path) => !path.classList.contains("ink-drawn"))) return;
    paths.forEach((path) => path.classList.remove("ink-drawn"));
  }, []);

  return (
    <span aria-hidden="true" className={["relative block shrink-0", className].filter(Boolean).join(" ")} onPointerEnter={redraw}>
      <InkSvg ref={ref} pending box={[0, 0, 64, 44]} className="inset-0 size-full">
        {strokes.map((d, i) => (
          <Stroke key={i} d={d} draw="auto" delay={Math.round(i * Math.min(130, 700 / strokes.length))} duration={320} width={1.5} />
        ))}
      </InkSvg>
    </span>
  );
}
