"use client";

import { useMemo, type ComponentProps } from "react";
import { useInkFrame } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { crossedBoxStroke, hashSeed } from "@/registry/ballpoint/lib/ink-sketch";
import { cn } from "@/lib/utils";

/** A light pencil box around a region, drawn twice and not quite lined up. */
export function DrawnFrame({ seed, className, children, ...props }: ComponentProps<"div"> & { seed: string }) {
  const { ref, w, h, frame } = useInkFrame([720, 320], { pad: 8, step: 4 });
  const s = hashSeed(seed);
  const passes = useMemo(
    () => [crossedBoxStroke(s, w, h, { overshoot: 6, jitter: 1.4 }), crossedBoxStroke(s + 1, w, h, { overshoot: 9, jitter: 2, shift: [1.5, -1.2] })],
    [s, w, h],
  );
  return (
    <div className={cn("relative", className)} {...props}>
      <InkSvg ref={ref} {...frame} className="text-ink-4">
        <Stroke d={passes[0]} width={1.2} />
        <Stroke d={passes[1]} width={0.9} opacity={0.7} />
      </InkSvg>
      {children}
    </div>
  );
}
