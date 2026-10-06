import type { CSSProperties, ReactNode, Ref } from "react";
import type { InkStroke } from "@/registry/ballpoint/lib/ink-sketch";

// Server-safe drawing primitives. Every drawn part of a component is an
// absolutely positioned SVG overlay (InkSvg) holding pen strokes (Stroke)
// that can draw themselves in:
// - "auto":  the pen runs the first time the drawing scrolls into view
//            (the InkSvg is rendered `pending`; useInkBox releases it)
// - "mount": the pen runs once, as soon as the stroke renders
// - "hover": drawn while the nearest .ink-hover is hovered or focused
// - "focus": drawn while focus is inside the nearest .ink-within
// - "checked" / "indeterminate": drawn while the SVG's parent carries
//            data-checked / data-indeterminate (Base UI's state attributes)
// - "none":  always fully drawn
// State strokes draw in on the pen curve and pull back out quicker.
// Widths and timings scale with --ink-weight and --ink-speed.

export type DrawMode = "auto" | "mount" | "hover" | "focus" | "checked" | "indeterminate" | "none";

const drawClass: Record<DrawMode, string> = {
  auto: "ink-draw",
  mount: "ink-draw",
  hover: "ink-hover-draw",
  focus: "ink-focus-draw",
  checked: "ink-checked-draw",
  indeterminate: "ink-indeterminate-draw",
  none: "",
};

export function Stroke({
  d,
  draw = "none",
  delay = 0,
  duration = 500,
  width,
  opacity,
  className,
}: {
  d: string;
  draw?: DrawMode;
  /** ms before the pen starts. */
  delay?: number;
  /** ms the pen takes. */
  duration?: number;
  width?: number;
  opacity?: number;
  className?: string;
}) {
  return (
    <path
      d={d}
      pathLength={1}
      className={[drawClass[draw], className].filter(Boolean).join(" ") || undefined}
      opacity={opacity}
      // Plain numbers: the shared rules in base.css scale them by
      // --ink-weight and --ink-speed, so each path parses no calc() of its own.
      style={{ "--ink-w": width, "--ink-d": `${duration}ms`, "--ink-dd": `${delay}ms` } as CSSProperties}
    />
  );
}

export function InkSvg({
  box,
  stretch = false,
  pending = false,
  className,
  style,
  ref,
  children,
}: {
  /** viewBox as [x, y, w, h]. */
  box: readonly [number, number, number, number];
  /** Fill the element box exactly (strokes are regenerated to the real size, so this only absorbs rounding). */
  stretch?: boolean;
  /** Hold "auto" strokes undrawn until useInkBox sees the drawing scroll into view. */
  pending?: boolean;
  className?: string;
  style?: CSSProperties;
  ref?: Ref<SVGSVGElement>;
  children: ReactNode;
}) {
  return (
    <svg
      ref={ref}
      aria-hidden="true"
      focusable="false"
      data-ink-pending={pending ? "" : undefined}
      viewBox={box.join(" ")}
      preserveAspectRatio={stretch ? "none" : undefined}
      className={["ink-sketch absolute", className].filter(Boolean).join(" ")}
      style={style}
    >
      {children}
    </svg>
  );
}

/**
 * Pressured ink ribbons drawn on in order: each pass is revealed by a mask
 * stroke running along its centreline, one mask per pass so crossing
 * strokes never reveal each other early.
 */
export function InkMarks({
  id,
  strokes,
  draw = "mount",
  delay = 0,
  guide = 8,
}: {
  id: string;
  strokes: InkStroke[];
  draw?: DrawMode;
  delay?: number;
  guide?: number;
}) {
  return (
    <>
      <defs>
        {strokes.map((k, i) => (
          <mask key={i} id={`${id}-${i}`} maskUnits="userSpaceOnUse" x={-2000} y={-2000} width={6000} height={6000}>
            <Stroke d={k.guide} draw={draw} delay={delay + k.at} duration={k.dur} width={guide} className="ink-guide" />
          </mask>
        ))}
      </defs>
      {strokes.map((k, i) => (
        <path key={i} d={k.ink} className="ink-ribbon" opacity={k.opacity} mask={`url(#${id}-${i})`} />
      ))}
    </>
  );
}
