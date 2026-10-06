"use client";

import { useId, useMemo, type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { penStyle, useInkBox, useInkSeed, usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkMarks, InkSvg } from "@/registry/ballpoint/lib/ink";
import { inkPulls, speckPulls, underlineInk } from "@/registry/ballpoint/lib/ink-sketch";

/**
 * A section title in block capitals, written in by hand and underlined with
 * a swoosh: the pen lands short of the word, pulls right, snaps back under
 * itself and runs on past the end. `specks` adds the few scratches a pen
 * leaves when it's lifted. Written the first time it scrolls into view.
 */
function SectionHeading({
  as: Tag = "h2",
  id,
  specks = false,
  delay = 0,
  seed,
  className,
  children,
  draw,
  weight,
  speed,
}: Pick<Pen, "draw" | "weight" | "speed"> & {
  as?: "h1" | "h2" | "h3" | "h4";
  id?: string;
  specks?: boolean;
  /** ms after it comes into view before the pen starts. */
  delay?: number;
  seed?: string | number;
  className?: string;
  children: ReactNode;
}) {
  const pen = usePen({ draw, weight, speed });
  const s = useInkSeed(seed ?? id);
  const uid = useId().replace(/[^\w-]/g, "");
  const text = typeof children === "string" ? children : "";
  // Block capitals in the hand run about 0.75em a letter.
  const [ref, [w]] = useInkBox([Math.max(60, Math.round(text.length * 15)), 40]);
  const [specksRef] = useInkBox([30, 9]);
  const mode = pen.draw === "none" ? "none" : pen.draw === "mount" ? "mount" : "auto";
  const strokes = useMemo(
    () =>
      w >= 70
        ? underlineInk(s, w, { weight: 2.4 })
        : // Too short for the snap-back: one rising pull, gone over lighter.
          inkPulls(s, [[[-8, 12], [w * 0.5, 7], [w + 10, 3]]], { weight: 2.4, dur: 360, retrace: 1, wander: 1.4 }),
    [s, w],
  );
  const flecks = useMemo(() => (specks ? inkPulls(s + 7, speckPulls(s + 7), { weight: 1.2, dur: 70, gap: 60 }) : []), [s, specks]);
  // Written over about as long as it takes to write the word.
  const writing = Math.min(1100, 380 + text.length * 30);
  const style = penStyle(pen);

  return (
    // The swoosh sits inside the heading's box (pb), so whatever follows
    // starts below it rather than under it.
    <div data-slot="section-heading" className="relative w-fit max-w-full pb-3.5" style={style}>
      <Tag
        id={id}
        className={cn("text-2xl font-bold tracking-[0.07em] uppercase", mode !== "none" && "ink-write", className)}
        style={{ "--ink-d": `${writing}ms`, "--ink-dd": `${delay}ms` } as CSSProperties}
      >
        {children}
      </Tag>
      <InkSvg ref={ref} pending={mode === "auto"} box={[-20, -3, w + 42, 20]} stretch className="bottom-0" style={{ left: -20, width: "calc(100% + 42px)", height: 20 }}>
        <InkMarks id={`u${uid}`} strokes={strokes} draw={mode} delay={delay + writing * 0.6} />
      </InkSvg>
      {specks && (
        <InkSvg ref={specksRef} pending={mode === "auto"} box={[0, 0, 30, 9]} className="-right-12 bottom-0 text-ink-3" style={{ width: 30, height: 9 }}>
          <InkMarks id={`s${uid}`} strokes={flecks} draw={mode} delay={delay + writing * 0.6 + 760} guide={5} />
        </InkSvg>
      )}
    </div>
  );
}

export { SectionHeading };
