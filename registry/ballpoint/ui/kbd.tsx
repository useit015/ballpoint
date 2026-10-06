"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { Stroke } from "@/registry/ballpoint/lib/ink";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";
import { lineStroke } from "@/registry/ballpoint/lib/ink-sketch";

/** A keycap sketched as a small box with a heavier bottom edge. */
function Kbd({
  className,
  seed,
  roughness,
  radius,
  draw,
  weight,
  speed,
  ...props
}: ComponentProps<"kbd"> & Pick<Pen, "roughness" | "radius" | "draw" | "weight" | "speed"> & { seed?: string | number }) {
  const pen = usePen({ roughness, radius: radius ?? 4, draw, weight, speed, passes: 1, corners: "joined" });
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none relative inline-flex h-6 w-fit min-w-6 items-center justify-center gap-1 px-1.5 font-sans text-sm text-ink-2 select-none [&_svg:not(.ink-sketch):not([class*='size-'])]:size-3.5",
        className,
      )}
      {...props}
    >
      <InkOutline pen={pen} seed={seed} estimate={[24, 24]} pad={5} className="text-ink-line">
        {({ w, h, s }) => <Stroke d={lineStroke(s + 30, [1.5, h + 1.4], [w - 1, h + 1.2], { bow: 0.4, jitter: 0.2 })} draw={pen.draw ?? "auto"} delay={260} duration={200} width={1.6} />}
      </InkOutline>
      {props.children}
    </kbd>
  );
}

function KbdGroup({ className, ...props }: ComponentProps<"kbd">) {
  return <kbd data-slot="kbd-group" className={cn("inline-flex items-center gap-1.5 font-sans", className)} {...props} />;
}

export { Kbd, KbdGroup };
