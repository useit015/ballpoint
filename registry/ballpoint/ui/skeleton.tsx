"use client";

import { useMemo, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { useInkBox, useInkSeed } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { hatchStrokes } from "@/registry/ballpoint/lib/ink-sketch";

/**
 * A placeholder pencilled in with light hatching that the pen keeps going
 * back over while you wait. With reduced motion the hatching just sits there.
 */
function Skeleton({ className, seed, ...props }: ComponentProps<"div"> & { seed?: string | number }) {
  const s = useInkSeed(seed);
  const [ref, [w, h]] = useInkBox([160, 20], { step: 4 });
  const strokes = useMemo(() => hatchStrokes(s, w, h, { gap: 4.2, angle: -55, jitter: 0.5 }), [s, w, h]);
  return (
    // Clipped by its own border-radius, so rounded-full makes a round placeholder.
    <div data-slot="skeleton" aria-hidden="true" className={cn("relative overflow-hidden rounded-md", className)} {...props}>
      <InkSvg ref={ref} box={[0, 0, w, h]} stretch className="inset-0 size-full text-ink-4">
        <g>
          {strokes.map((d, i) => (
            <Stroke
              key={i}
              d={d}
              width={1}
              opacity={0.8}
              className="ink-scribble [stroke-dasharray:1.05_1.05] [animation:ink-scribble_1.8s_var(--ease-write)_infinite_alternate] [animation-delay:var(--ink-dd)]"
              delay={(i % 12) * 70}
            />
          ))}
        </g>
      </InkSvg>
    </div>
  );
}

/**
 * A paragraph's worth of placeholder: `lines` lines, the last one shorter, each
 * a different length so it reads as text and not as a block.
 */
function SkeletonText({ lines = 3, className, seed }: { lines?: number; className?: string; seed?: string | number }) {
  const widths = ["100%", "92%", "97%", "84%", "95%", "88%"];
  return (
    <div aria-hidden="true" className={cn("flex flex-col gap-2.5", className)}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton key={i} className="h-4" style={{ width: i === lines - 1 && lines > 1 ? "58%" : widths[i % widths.length] }} seed={`${seed ?? "skeleton-text"}-${i}`} />
      ))}
    </div>
  );
}

export { Skeleton, SkeletonText };
