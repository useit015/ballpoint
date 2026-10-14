"use client";

import { useId, useMemo, type CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { penStyle, useInkBox, useInkSeed, usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkMarks, InkSvg } from "@/registry/ballpoint/lib/ink";
import { asteriskPulls, cornerPulls, crossPulls, inkPulls, loopPulls, ringPulls, slashPulls, spiralPulls, starPulls, tickPulls, wavePulls, zigzagPulls } from "@/registry/ballpoint/lib/ink-sketch";

export type ScrawlKind = "zigzag" | "corner" | "star" | "slash" | "spiral" | "loops" | "waves" | "cross" | "asterisk" | "ring" | "tick";

// Each kind's size, and how fast it goes on: ms per pull and between pulls.
const KINDS: Record<ScrawlKind, { size: [number, number]; dur: number; gap: number; bow?: number }> = {
  zigzag: { size: [40, 92], dur: 200, gap: 0 },
  corner: { size: [80, 150], dur: 130, gap: 50 },
  star: { size: [46, 50], dur: 110, gap: 50 },
  slash: { size: [48, 22], dur: 70, gap: 45 },
  spiral: { size: [56, 56], dur: 40, gap: 0, bow: 0.12 },
  loops: { size: [120, 38], dur: 40, gap: 0, bow: 0.12 },
  waves: { size: [112, 28], dur: 90, gap: 60, bow: 0.12 },
  cross: { size: [44, 44], dur: 130, gap: 50 },
  asterisk: { size: [42, 42], dur: 110, gap: 40 },
  ring: { size: [64, 46], dur: 60, gap: 60, bow: 0.15 },
  tick: { size: [40, 34], dur: 110, gap: 0 },
};

const PULLS: Record<ScrawlKind, (seed: number, w: number, h: number) => ReturnType<typeof zigzagPulls>> = {
  zigzag: (seed, w, h) => zigzagPulls(seed, w, h, { passes: 6 + (seed % 3) }),
  corner: cornerPulls,
  star: starPulls,
  slash: slashPulls,
  spiral: spiralPulls,
  loops: loopPulls,
  waves: wavePulls,
  cross: crossPulls,
  asterisk: asteriskPulls,
  ring: ringPulls,
  tick: tickPulls,
};

// How much each kind is gone over by default: slashes least, tidy shapes not at all.
const RETRACE: Record<ScrawlKind, number> = { zigzag: 0.75, corner: 0.75, star: 0.75, slash: 0.3, spiral: 0, loops: 0, waves: 0.2, cross: 0.5, asterisk: 0.5, ring: 0, tick: 0.3 };

/**
 * The scratches a ballpoint collects in a margin while someone gets it
 * going: a zigzag, a worked-over corner, a hurried star, a patch of slashes,
 * a spiral, a row of loops, a wave; and the marks of a proofreader: a cross,
 * an asterisk, a ring, a tick. In the ink or the red pen. Purely decorative
 * (hidden from screen readers); place it with a class (absolute, in the
 * page margin). Drawn as it scrolls into view.
 */
function Scrawl({
  kind = "zigzag",
  scale = 1,
  rotate = 0,
  flip = false,
  color = "ink",
  retrace,
  delay = 0,
  className,
  style,
  seed,
  draw,
  weight,
  speed,
}: Pick<Pen, "draw" | "weight" | "speed"> & {
  kind?: ScrawlKind;
  scale?: number;
  /** Degrees. */
  rotate?: number;
  /** Mirror it, so the same scribble can lean the other way. */
  flip?: boolean;
  /** The ink, or the red pen. */
  color?: "ink" | "red";
  /** 0 to 1: how much of it the pen goes back over. Each kind has its own habit. */
  retrace?: number;
  /** ms after it comes into view before the pen starts. */
  delay?: number;
  className?: string;
  style?: CSSProperties;
  seed?: string | number;
}) {
  const pen = usePen({ draw, weight, speed });
  const s = useInkSeed(seed);
  const id = useId().replace(/[^\w-]/g, "");
  const { size, dur, gap, bow } = KINDS[kind];
  const [ref] = useInkBox(size);
  const mode = pen.draw === "none" ? "none" : pen.draw === "mount" ? "mount" : "auto";
  const strokes = useMemo(() => {
    const [w, h] = size;
    // Scrawls get gone over, each kind by its own habit.
    return inkPulls(s, PULLS[kind](s, w, h), { weight: (1.3 * (pen.weight ?? 1)) / scale, opacity: 0.9, dur, gap, bow, retrace: retrace ?? RETRACE[kind] });
  }, [kind, s, size, dur, gap, bow, scale, retrace, pen.weight]);

  return (
    <span
      aria-hidden="true"
      data-slot="scrawl"
      data-kind={kind}
      className={cn("pointer-events-none relative inline-block", color === "red" ? "text-pen-red" : "text-ink-2", className)}
      style={{ width: size[0] * scale, height: size[1] * scale, rotate: `${rotate}deg`, scale: flip ? "-1 1" : undefined, ...penStyle(pen), ...style }}
    >
      <InkSvg ref={ref} pending={mode === "auto"} box={[0, 0, size[0], size[1]]} className="inset-0 size-full">
        <InkMarks id={`sc${id}`} strokes={strokes} draw={mode} delay={delay} guide={6 / scale} />
      </InkSvg>
    </span>
  );
}

export { Scrawl };
