"use client";

import { useMemo, type ReactNode } from "react";
import { useInkBox } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkMarks, InkSvg } from "@/registry/ballpoint/lib/ink";
import { hashSeed, inkPulls, underlineInk } from "@/registry/ballpoint/lib/ink-sketch";
import { cn } from "@/lib/utils";

const em = { h1: 34, h2: 20, h3: 20 } as const;

/**
 * A page or section title, underlined the way a hand underlines with
 * emphasis, redrawn to the title's measured width.
 */
export function Heading({
  as: Tag = "h2",
  id,
  children,
  className,
}: {
  as?: "h1" | "h2" | "h3";
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  const text = typeof children === "string" ? children : (id ?? "heading");
  const s = hashSeed(`${id ?? text}-underline`);
  // Gaegu bold runs about 0.55em a character.
  const [ref, [w]] = useInkBox([Math.round(text.length * em[Tag] * 0.55), 40]);
  const weight = Tag === "h1" ? 2.6 : 2.2;
  const strokes = useMemo(
    () =>
      w >= 70
        ? underlineInk(s, w, { weight })
        : // Too short for the snap-back: one rising pull, gone over lighter.
          inkPulls(s, [[[-8, 12], [w * 0.5, 7], [w + 10, 3]]], { weight, dur: 360, retrace: 1, wander: 1.4 }),
    [s, w, weight],
  );
  return (
    // The underline sits inside the heading's own box (pb), so whatever
    // follows starts below it rather than under it.
    <div className="relative w-fit max-w-full pb-3.5">
      <Tag id={id} className={cn("font-bold tracking-wide uppercase", className)}>
        {children}
      </Tag>
      <InkSvg ref={ref} pending box={[-20, -3, w + 42, 20]} stretch className="bottom-0" style={{ left: -20, width: "calc(100% + 42px)", height: 20 }}>
        <InkMarks id={`u${s.toString(36)}`} strokes={strokes} draw="auto" delay={200} />
      </InkSvg>
    </div>
  );
}
