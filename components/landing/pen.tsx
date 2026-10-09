import type { CSSProperties, Ref } from "react";
import { createRng, handCurve, hashSeed, hatchStrokes } from "@/registry/ballpoint/lib/ink-sketch";

type P = readonly [number, number];

// A stick ballpoint drawn in its own ink: laid along +x with the ball at the
// origin, then turned up to the angle a right hand holds it at. Units are
// hundredths of an em of the element's font size, so it's three ems long.

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
    return handCurve(seed + Math.round(x0 * 7 + y0 * 13), pts, {
      jitter: 0.35,
    });
  };
  const ring = (x: number, rad: number) =>
    handCurve(
      seed + x,
      [
        [x - 0.6, -rad],
        [x + 0.7, 0],
        [x - 0.4, rad],
      ],
      { jitter: 0.2 },
    );

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
    handCurve(
      seed + 3,
      [
        [290, -R.cap],
        [295.5, -5],
        [296.5, 4],
        [290, R.cap],
      ],
      { jitter: 0.25 },
    ),
    handCurve(
      seed + 4,
      [
        [289, -R.cap],
        [291, -R.cap - 5],
        [262, -R.cap - 5.4],
        [228, -R.cap - 5.2],
        [223.5, -R.cap - 2.6],
      ],
      { jitter: 0.3 },
    ),
  ];
  // The refill seen through the clear barrel: a thin tube, inked to here.
  const tube = [edge(18, -2.1, 222, -2.1), edge(18, 2.1, 222, 2.1)];
  const ink = `M18 -2.1L${172 + r() * 10} -2.1L${172 + r() * 10} 2.1L18 2.1Z`;
  // Shade under the barrel, and the cap coloured in.
  const shade = hatchStrokes(seed + 5, 170, R.nose - 4, {
    gap: 4.6,
    angle: -62,
    jitter: 0.4,
  }).map((d) => ({ d, at: [42, 3.8] as P }));
  const cap = hatchStrokes(seed + 6, 72, 2 * R.cap - 1.4, {
    gap: 2.4,
    angle: -58,
    jitter: 0.3,
  }).map((d) => ({ d, at: [216, -R.cap + 0.7] as P }));
  const body = `M0 -1L11 -${R.tip}L36 -${R.nose}L214 -${R.nose}L214 -${R.cap}L292 -${R.cap}Q297 0 292 ${R.cap}L214 ${R.cap}L214 ${R.nose}L36 ${R.nose}L11 ${R.tip}L0 1Z`;
  return { outline, tube, ink, shade, cap, body };
}

// The drawing's box once turned: the corners of the pen's own box, rotated.
const VIEW = (() => {
  const [c, s] = [Math.cos((TILT * Math.PI) / 180), Math.sin((TILT * Math.PI) / 180)];
  const pts = [
    [-2, -19],
    [298, -19],
    [298, 14],
    [-2, 14],
  ].map(([x, y]) => [x * c - y * s, x * s + y * c]);
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  const [x0, y0] = [Math.min(...xs) - 4, Math.min(...ys) - 4];
  return [x0, y0, Math.max(...xs) + 16 - x0, Math.max(...ys) + 16 - y0] as const;
})();

const art = penArt(hashSeed("sketch-pen"));

/**
 * The pen, with its ball at the element's top left corner: move it with a
 * transform and it writes wherever it's put. `size` is a third of its length.
 */
export function Pen({ size, className, ref }: { size: number; className?: string; ref?: Ref<HTMLSpanElement> }) {
  const [vx, vy, vw, vh] = VIEW;
  return (
    <span ref={ref} aria-hidden="true" className={className} style={{ fontSize: size } as CSSProperties}>
      <svg
        viewBox={VIEW.join(" ")}
        className="ink-sketch absolute overflow-visible text-ink"
        style={{
          left: `${vx / 100}em`,
          top: `${vy / 100}em`,
          width: `${vw / 100}em`,
          height: `${vh / 100}em`,
        }}
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
