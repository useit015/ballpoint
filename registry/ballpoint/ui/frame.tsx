"use client";

import { useMemo, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { penStyle, useInkFrame, useInkSeed, usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { crossedBoxStroke } from "@/registry/ballpoint/lib/ink-sketch";

/**
 * A photo frame ruled round a picture (or anything): each side pulled on
 * its own, well past the corners, then gone over again a little off the
 * first, so the corners cross like a quick sketch. `caption` is written
 * underneath; the whole is a <figure>. `tilt` sets it a little askew and
 * `tape` holds the picture down with a strip of washi tape.
 */
function Frame({
  children,
  caption,
  gap = 6,
  tilt = 0,
  tape = false,
  seed,
  className,
  style,
  draw,
  roughness,
  passes,
  weight,
  speed,
  ...props
}: Omit<ComponentProps<"figure">, "children"> &
  Pick<Pen, "draw" | "roughness" | "passes" | "weight" | "speed"> & {
    children: ReactNode;
    /** Written under the frame. */
    caption?: ReactNode;
    /** px between the picture and the frame. */
    gap?: number;
    /** Degrees to turn it, as if it were dropped there. */
    tilt?: number;
    /** A strip of washi tape across the top. */
    tape?: boolean;
    seed?: string | number;
  }) {
  const pen = usePen({ draw, roughness, passes, weight, speed });
  const s = useInkSeed(seed);
  const { ref, w, h, frame } = useInkFrame([200, 200], { pad: 16 });
  const q = pen.roughness ?? 1;
  const n = pen.passes ?? 2;
  const mode = pen.draw ?? "auto";
  const strokes = useMemo(
    () =>
      [
        crossedBoxStroke(s, w, h, { overshoot: 7 * q, jitter: 1.4 * q, bow: 1.1 * q }),
        crossedBoxStroke(s + 1, w, h, { overshoot: 11 * q, jitter: 2 * q, bow: 1.2 * q, shift: [2 * q, -1.5 * q] }),
        crossedBoxStroke(s + 2, w, h, { overshoot: 9 * q, jitter: 2.2 * q, bow: 1.2 * q, shift: [-1.5 * q, 2 * q] }),
      ].slice(0, n),
    [s, w, h, q, n],
  );

  return (
    <figure data-slot="frame" className={cn("relative inline-flex w-fit max-w-full flex-col items-center gap-3", className)} style={{ ...(tilt ? { rotate: `${tilt}deg` } : null), ...style }} {...props}>
      <div data-slot="frame-picture" className="relative max-w-full *:[img]:block" style={{ padding: gap }}>
        <InkSvg ref={ref} {...frame} pending={mode === "auto"} className="text-ink" style={{ ...frame.style, ...penStyle(pen) }}>
          {strokes.map((d, i) => (
            <Stroke key={i} d={d} draw={mode} delay={i * 380} duration={[560, 460, 420][i]} width={[1.5, 1.1, 1][i]} opacity={[1, 0.75, 0.6][i]} />
          ))}
        </InkSvg>
        {children}
        {tape && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 -rotate-3 bg-[oklch(0.86_0.07_88/0.62)] dark:bg-[oklch(0.72_0.06_88/0.4)]"
            style={{
              backgroundImage: "repeating-linear-gradient(115deg, oklch(1 0 0 / 0.16) 0 7px, transparent 7px 14px)",
              clipPath: "polygon(0 0, 3% 20%, 0 42%, 3% 64%, 0 86%, 2% 100%, 100% 100%, 97% 80%, 100% 58%, 97% 36%, 100% 14%, 98% 0)",
            }}
          />
        )}
      </div>
      {caption && (
        <figcaption data-slot="frame-caption" className="text-center text-sm text-ink-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

export { Frame };
