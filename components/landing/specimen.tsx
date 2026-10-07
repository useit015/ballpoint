"use client";

import { useId, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { useInkBox, useInkFrame } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkMarks, InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { crossedBoxStroke, hashSeed, penBoxStrokes, underlineShape } from "@/registry/ballpoint/lib/ink-sketch";
import { Button } from "@/registry/ballpoint/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";
import { Slider } from "@/registry/ballpoint/ui/slider";
import { PenArrow } from "@/components/landing/pen-arrow";

/**
 * One drawing, taken apart: a card whose every line comes from the seed
 * typed under it. The same words always draw the same card; the width
 * slider makes it draw the lines again for the new size; and it can be
 * drawn in again from scratch.
 */
export function Specimen() {
  const [text, setText] = useState("Ada Lovelace");
  const [width, setWidth] = useState(100);
  const [take, setTake] = useState(0);
  const seed = hashSeed(text || " ");

  return (
    <div className="grid gap-x-10 gap-y-10 xl:grid-cols-[13rem_minmax(0,1fr)_13rem]">
      <div className="flex min-w-0 flex-col gap-8 xl:col-start-2 xl:row-start-1">
        <div className="flex h-64 items-center justify-center sm:h-72">
          <div className="h-full transition-[width] duration-(--dur-state) ease-out motion-reduce:transition-none" style={{ width: `${width}%` }}>
            <Card key={take} seed={seed} text={text} />
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] sm:items-start">
          <Field>
            <FieldLabel htmlFor="specimen-seed">Seed</FieldLabel>
            <Input id="specimen-seed" value={text} maxLength={28} onChange={(e) => setText(e.target.value)} autoComplete="off" spellCheck={false} />
            <FieldDescription>Type anything: your name draws its own card.</FieldDescription>
          </Field>
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <span id="specimen-width">Width</span>
              <span className="font-mono text-sm text-ink-3">{width}%</span>
            </div>
            <Slider value={width} min={55} max={100} step={1} onValueChange={(v) => setWidth(v as number)} aria-labelledby="specimen-width" seed="specimen-width" />
            <Button variant="outline" size="sm" className="mt-2 self-start" seed="specimen-again" onClick={() => setTake((n) => n + 1)}>
              Draw it again
            </Button>
          </div>
        </div>
      </div>

      <Notes side="left">
        <Note title="Seeded" arrow={{ from: [4, 30], to: [86, 64], size: [96, 90], bend: -0.4 }}>
          The same seed draws the same wobble on the server and in the browser, so nothing jumps when the page wakes up.
        </Note>
        <Note title="Drawn in" arrow={{ from: [4, 92], to: [90, 6], size: [96, 100], bend: -0.3 }} place="-top-16">
          Each line runs once, the first time it scrolls into view, at the speed a hand would draw it.
        </Note>
      </Notes>

      <Notes side="right">
        <Note title="Redrawn to fit" arrow={{ from: [92, 24], to: [8, 70], size: [96, 90], bend: 0.4 }}>
          Make it narrower and the lines are drawn again for the new size, never squashed. One ResizeObserver watches every box on the page.
        </Note>
        <Note title="Yours to change" arrow={{ from: [92, 92], to: [6, 6], size: [96, 100], bend: 0.3 }} place="-top-16">
          Roughness, passes, corners, fills and line weight are props, or set once for the whole app.
        </Note>
      </Notes>
    </div>
  );
}

function Notes({ side, children }: { side: "left" | "right"; children: ReactNode }) {
  return (
    <aside
      data-side={side}
      className="group/notes grid gap-x-10 gap-y-6 sm:grid-cols-2 xl:row-start-1 xl:grid-cols-1 xl:content-between xl:gap-y-10 xl:py-4 xl:data-[side=left]:col-start-1 xl:data-[side=right]:col-start-3"
    >
      {children}
    </aside>
  );
}

/** A note in the margin, and on wide screens an arrow from it to the card. */
function Note({
  title,
  arrow,
  place = "top-1/3",
  children,
}: {
  title: string;
  /** Where the arrow starts, down the note. */
  place?: string;
  arrow: { from: readonly [number, number]; to: readonly [number, number]; size: readonly [number, number]; bend: number };
  children: ReactNode;
}) {
  return (
    <div className="relative flex flex-col gap-1">
      <p className="text-lg font-bold">{title}</p>
      <p className="text-ink-2">{children}</p>
      <PenArrow
        seed={`note-${title}`}
        {...arrow}
        delay={500}
        className={`${place} hidden text-ink-3 group-data-[side=left]/notes:-right-24 group-data-[side=right]/notes:-left-24 xl:block`}
      />
    </div>
  );
}

/** The card itself: three passes of the pen, a hatched shadow, the seed written in and underlined. */
function Card({ seed, text }: { seed: number; text: string }) {
  const uid = useId().replace(/[^\w-]/g, "");
  const { ref, w, h, frame } = useInkFrame([560, 288], { pad: 14 });
  const [lineRef, [tw]] = useInkBox([260, 22]);
  const { passes, shadow, hatch } = useMemo(() => {
    const passes = penBoxStrokes(seed, w, h, { roughness: 1.8, passes: 3 });
    const shadow = crossedBoxStroke(seed + 9, w, h, { overshoot: 4, jitter: 1.4, bow: 1.2, shift: [7, 7] });
    return { passes, shadow, hatch: `${uid}-hatch` };
  }, [seed, w, h, uid]);
  const underline = useMemo(() => underlineShape(seed + 3, Math.max(70, tw)), [seed, tw]);

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-1 px-6">
      <InkSvg ref={ref} {...frame} pending className="-z-10 text-ink">
        <defs>
          <pattern id={hatch} patternUnits="userSpaceOnUse" width={3.4} height={3.4} patternTransform="rotate(-45)">
            <path d="M0 -1V4.4" style={{ strokeWidth: 1 }} />
          </pattern>
        </defs>
        {/* The card is lifted off the page: its shadow, hatched, then its face. */}
        <rect
          x={7}
          y={7}
          width={w}
          height={h}
          className="ink-land"
          style={{ fill: `url(#${hatch})`, stroke: "none", "--ink-d": "500ms", "--ink-dd": "800ms" } as CSSProperties}
          opacity={0.55}
        />
        <rect x={0} y={0} width={w} height={h} style={{ fill: "var(--paper)", stroke: "none" }} />
        <Stroke d={shadow} draw="auto" delay={900} duration={420} width={0.9} opacity={0.6} />
        {passes.map((d, i) => (
          <Stroke key={i} d={d} draw="auto" delay={i * 300} duration={[520, 440, 400][i]} width={[1.5, 1.1, 0.9][i]} opacity={[1, 0.75, 0.55][i]} />
        ))}
      </InkSvg>
      <span className="absolute top-3 left-4 font-mono text-xs text-ink-3 [font-variation-settings:'MONO'_1,'CASL'_1]">seed {seed}</span>
      <span className="relative max-w-full truncate px-2 pb-6 text-4xl font-bold sm:text-5xl">
        {text || " "}
        <InkSvg ref={lineRef} pending box={[-4, 0, tw + 8, 21]} stretch className="inset-x-0 bottom-0" style={{ left: -4, width: "calc(100% + 8px)", height: 21 }}>
          <InkMarks id={`sp${uid}`} strokes={underline} draw="auto" delay={700} />
        </InkSvg>
      </span>
    </div>
  );
}
