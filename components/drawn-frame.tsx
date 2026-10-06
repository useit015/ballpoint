"use client";

import { useMemo, type ComponentProps } from "react";
import { useInkFrame } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { crossedBoxStroke, hashSeed } from "@/registry/ballpoint/lib/ink-sketch";
import { cn } from "@/lib/utils";

/** A light pencil box around a region: one pass, the sides run a little past each other. */
export function DrawnFrame({ seed, className, children, ...props }: ComponentProps<"div"> & { seed: string }) {
  const { ref, w, h, frame } = useInkFrame([720, 320], { pad: 8, step: 4 });
  const s = hashSeed(seed);
  const d = useMemo(() => crossedBoxStroke(s, w, h, { overshoot: 5, jitter: 1.1 }), [s, w, h]);
  return (
    <div className={cn("relative", className)} {...props}>
      <InkSvg ref={ref} {...frame} className="text-ink-4">
        <Stroke d={d} width={1.25} />
      </InkSvg>
      {children}
    </div>
  );
}
