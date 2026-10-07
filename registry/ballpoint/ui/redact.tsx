"use client";

import { useMemo, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { penStyle, useInkBox, useInkSeed, usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { createRng, shadeFill } from "@/registry/ballpoint/lib/ink-sketch";

/**
 * Words scribbled out with the pen, the way you'd black out a line in a
 * notebook. Clicking (or Enter, or Space) pulls the scribble back off and
 * shows them; again, and they're scribbled over. Until then screen readers
 * hear only that something is hidden, not what.
 */
function Redact({
  children,
  label = "Hidden text",
  defaultRevealed = false,
  revealed: revealedProp,
  onRevealedChange,
  className,
  seed,
  roughness,
  weight,
  speed,
}: Pick<Pen, "roughness" | "weight" | "speed"> & {
  children: ReactNode;
  /** What screen readers hear while it's hidden. */
  label?: string;
  defaultRevealed?: boolean;
  revealed?: boolean;
  onRevealedChange?: (revealed: boolean) => void;
  className?: string;
  seed?: string | number;
}) {
  const pen = usePen({ roughness, weight, speed });
  const s = useInkSeed(seed);
  const [own, setOwn] = useState(defaultRevealed);
  const revealed = revealedProp ?? own;
  const [ref, [w, h]] = useInkBox([100, 26]);
  const q = pen.roughness ?? 1;

  // Shaded over twice, at two angles, so no word shows through the gaps.
  const passes = useMemo(() => {
    const r = createRng(s);
    return [
      shadeFill(s, w + 2, h * 0.62, { gap: 1.8, angle: -2 + (r() - 0.5) * 2 * q, overrun: 1.5 }),
      shadeFill(s + 1, w + 2, h * 0.5, { gap: 2.4, angle: 3 + (r() - 0.5) * 2 * q, overrun: 1 }),
    ];
  }, [s, w, h, q]);

  const toggle = () => {
    if (revealedProp === undefined) setOwn(!revealed);
    onRevealedChange?.(!revealed);
  };

  return (
    <button
      type="button"
      data-slot="redact"
      // data-checked while hidden: the scribble's state strokes stay drawn.
      data-checked={revealed ? undefined : ""}
      aria-pressed={revealed}
      className={cn(
        "relative inline cursor-pointer rounded-[2px] text-inherit outline-none [font:inherit]",
        "focus-visible:outline-solid focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
      style={penStyle(pen)}
      onClick={toggle}
    >
      <InkSvg ref={ref} box={[-3, 0, w + 6, h]} stretch className="inset-y-0 -left-[3px] h-full w-[calc(100%+6px)] text-ink">
        <g transform={`translate(-1 ${h * 0.2})`}>
          <Stroke d={passes[0]} draw="checked" duration={Math.min(700, 260 + w * 3)} width={2} />
        </g>
        <g transform={`translate(-1 ${h * 0.26})`}>
          <Stroke d={passes[1]} draw="checked" delay={80} duration={Math.min(600, 220 + w * 2.4)} width={1.6} opacity={0.85} />
        </g>
      </InkSvg>
      {!revealed && <span className="sr-only">{label}, press to show</span>}
      <span aria-hidden={!revealed} className={cn("transition-opacity duration-(--dur-state)", revealed ? "opacity-100 delay-150" : "opacity-0")}>
        {children}
      </span>
    </button>
  );
}

export { Redact };
