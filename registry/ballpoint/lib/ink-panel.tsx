"use client";

import { useId, useMemo } from "react";
import { penStyle, useInkFrame, useInkSeed, type InkSize, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { crossedBoxStroke, penBoxStrokes, roundedBoxStroke, roundedRectPath } from "@/registry/ballpoint/lib/ink-sketch";

/**
 * A piece of paper lifted off the page, for popups, dialogs and toasts: an
 * outline gone over `passes` times and the shadow it casts down and to the
 * right, hatched or solid as the pen's `shadow` says.
 *
 * Put it first inside a `relative isolate` element painted with paper
 * (`.ink-paper`), and give it the outline's colour with `className`. The
 * shadow is cut away under the face, so the face stays the element's own
 * background. It draws itself in as the popup appears.
 */
export function InkPanel({
  pen,
  seed,
  estimate,
  passes: defaultPasses = 2,
  offset = 6,
  maxRadius = 18,
  className,
}: {
  pen: Pen;
  seed?: string | number;
  estimate: InkSize;
  passes?: 1 | 2 | 3;
  /** How far the paper is lifted: the shadow's offset, in px. */
  offset?: number;
  /** The roundest the corners get, whatever the pen's radius. */
  maxRadius?: number;
  className?: string;
}) {
  const id = useId().replace(/[^\w-]/g, "");
  const s = useInkSeed(seed);
  const { ref, w, h, frame } = useInkFrame(estimate, { pad: 10 + offset });
  const draw = pen.draw ?? "mount";
  const roughness = pen.roughness ?? 1;
  const passes = pen.passes ?? defaultPasses;
  const corners = pen.corners ?? "crossed";
  const shadow = pen.shadow ?? "hatch";
  const r = Math.min(pen.radius === "full" ? h / 2 : (pen.radius ?? 0), h / 2, maxRadius);

  const paths = useMemo(
    () => ({
      body: roundedRectPath(w, h, r),
      passes: penBoxStrokes(s, w, h, { roughness, passes, corners, radius: r }),
      edge:
        shadow === "none"
          ? undefined
          : r > 0
            ? roundedBoxStroke(s + 9, w, h, r, { jitter: 0.4 * roughness, overrun: 0.02 })
            : crossedBoxStroke(s + 9, w, h, { overshoot: 3 * roughness, jitter: roughness, bow: 1.1 * roughness }),
    }),
    [s, w, h, r, roughness, passes, corners, shadow],
  );
  const { box } = frame;

  return (
    <InkSvg
      ref={ref}
      {...frame}
      pending={draw === "auto"}
      className={["-z-10", className].filter(Boolean).join(" ")}
      style={{ ...frame.style, ...penStyle(pen) }}
    >
      {paths.edge && (
        <>
          <defs>
            {shadow === "hatch" && (
              <pattern id={`${id}-hatch`} patternUnits="userSpaceOnUse" width={3.4} height={3.4} patternTransform="rotate(-45)">
                <path d="M0 -1V4.4" style={{ strokeWidth: 1 }} />
              </pattern>
            )}
            <mask id={`${id}-under`} maskUnits="userSpaceOnUse" x={box[0]} y={box[1]} width={box[2]} height={box[3]}>
              <rect x={box[0]} y={box[1]} width={box[2]} height={box[3]} fill="#fff" />
              <path d={paths.body} style={{ fill: "#000", stroke: "#000", strokeWidth: 1.5 }} />
            </mask>
          </defs>
          <g mask={`url(#${id}-under)`}>
            <g transform={`translate(${offset} ${offset})`} opacity={0.8}>
              <path d={paths.body} style={shadow === "hatch" ? { fill: `url(#${id}-hatch)`, stroke: "none" } : { fill: "currentColor", stroke: "none", opacity: 0.6 }} />
              <path d={paths.edge} style={{ strokeWidth: 1 }} />
            </g>
          </g>
        </>
      )}
      {paths.passes.map((d, i) => (
        <Stroke key={i} d={d} draw={draw} delay={i * 150} duration={[360, 300, 260][i]} width={[1.3, 1, 0.9][i]} opacity={[1, 0.75, 0.55][i]} />
      ))}
    </InkSvg>
  );
}
