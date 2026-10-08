"use client";

import { useMemo } from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";
import { penStyle, useInkBox, useInkSeed, usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { inkClassName, InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { ringStroke, ruleStroke, verticalStroke } from "@/registry/ballpoint/lib/ink-sketch";

// Track lines are drawn long and stretched along their length only.
const LENGTH = 700;
const THUMB = 20;

/**
 * A pencilled line with the chosen range inked over it, and a drawn ring to
 * drag. Ranges get one ring per value.
 */
function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  seed,
  draw,
  weight,
  speed,
  "aria-label": label,
  "aria-labelledby": labelledBy,
  ...props
}: SliderPrimitive.Root.Props & Pick<Pen, "draw" | "weight" | "speed"> & { seed?: string | number }) {
  const pen = usePen({ draw, weight, speed });
  // One thumb per value: a range slider takes an array.
  const values = Array.isArray(value) ? value : Array.isArray(defaultValue) ? defaultValue : [value ?? defaultValue ?? min];
  // The inputs live in the thumbs, so that's where the name goes; the two
  // ends of a range are told apart.
  const thumbLabel = (index: number) => (label && values.length > 1 ? `${label}, ${index === 0 ? "from" : "to"}` : label);
  return (
    <SliderPrimitive.Root
      className={inkClassName("data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="group/slider relative flex w-full touch-none items-center py-2 select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:px-2 data-[orientation=vertical]:py-0">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow text-ink-line select-none data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        >
          <SliderLine seed={seed} pen={pen} weight={1.3} />
          <SliderPrimitive.Indicator data-slot="slider-range" className="text-ink select-none data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full">
            <SliderLine seed={seed === undefined ? undefined : `${seed}-range`} pen={pen} weight={3} />
          </SliderPrimitive.Indicator>
        </SliderPrimitive.Track>
        {values.map((_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            aria-label={thumbLabel(index)}
            aria-labelledby={labelledBy}
            className={cn(
              "relative block size-5 shrink-0 cursor-grab text-ink select-none outline-none active:cursor-grabbing",
              "after:absolute after:-inset-2",
              "has-focus-visible:outline-solid has-focus-visible:outline-[1.5px] has-focus-visible:outline-offset-4 has-focus-visible:outline-ring has-focus-visible:rounded-full",
              "transition-transform duration-(--dur-press) group-data-dragging/slider:scale-110 motion-reduce:transition-none",
              "data-disabled:pointer-events-none",
            )}
          >
            <ThumbRing seed={seed === undefined ? undefined : `${seed}-thumb-${index}`} pen={pen} />
          </SliderPrimitive.Thumb>
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

/** A line along the track (or the inked range), following its orientation. */
function SliderLine({ seed, pen, weight }: { seed?: string | number; pen: Pen; weight: number }) {
  const s = useInkSeed(seed);
  const [ref] = useInkBox([LENGTH, 6]);
  const mode = pen.draw ?? "auto";
  const paths = useMemo(() => ({ h: ruleStroke(s, LENGTH), v: verticalStroke(s, LENGTH) }), [s]);
  return (
    <>
      <InkSvg
        ref={ref}
        pending={mode === "auto"}
        box={[0, -1, LENGTH, 5]}
        stretch
        className="inset-x-0 top-1/2 h-[5px] w-full -translate-y-1/2 group-data-[orientation=vertical]/slider:hidden"
        style={penStyle(pen)}
      >
        <Stroke d={paths.h} draw={mode} duration={600} width={weight} />
      </InkSvg>
      <InkSvg
        box={[0, -1, 3, LENGTH + 2]}
        stretch
        className="inset-y-0 left-1/2 hidden h-full w-[3px] -translate-x-1/2 group-data-[orientation=vertical]/slider:block"
        style={penStyle(pen)}
      >
        <Stroke d={paths.v} width={weight} />
      </InkSvg>
    </>
  );
}

/** A paper disc with a drawn ring, to drag. */
function ThumbRing({ seed, pen }: { seed?: string | number; pen: Pen }) {
  const s = useInkSeed(seed);
  const ring = useMemo(() => ringStroke(s + 60, THUMB, { turns: 1.1 }), [s]);
  return (
    <InkSvg box={[-2, -2, THUMB + 4, THUMB + 4]} className="inset-[-2px]" style={{ width: THUMB + 4, height: THUMB + 4, ...penStyle(pen) }}>
      <circle cx={THUMB / 2} cy={THUMB / 2} r={THUMB / 2} style={{ fill: "var(--paper)" }} />
      <Stroke d={ring} width={1.6} />
    </InkSvg>
  );
}

export { Slider };
