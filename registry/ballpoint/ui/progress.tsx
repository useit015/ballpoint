"use client";

import { createContext, useContext, useId, useMemo, type CSSProperties } from "react";
import { Progress as ProgressPrimitive } from "@base-ui/react/progress";
import { cn } from "@/lib/utils";
import { penStyle, useInkFrame, useInkSeed, usePen, type InkFill, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { inkClassName, InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { hatchStrokes, penBoxStrokes, roundedRectPath, scribbleFill, shadeFill } from "@/registry/ballpoint/lib/ink-sketch";

type TrackInk = { w: number; h: number; r: number; s: number; pen: Pen };
const TrackContext = createContext<TrackInk | null>(null);

function Progress({ className, children, value, seed, roughness, passes, radius, fill, draw, weight, speed, ...props }: ProgressPrimitive.Root.Props & TrackPen) {
  return (
    <ProgressPrimitive.Root value={value} data-slot="progress" className={inkClassName("group/progress flex flex-wrap gap-x-3 gap-y-2", className)} {...props}>
      {children}
      <ProgressTrack seed={seed} roughness={roughness} passes={passes} radius={radius} fill={fill} draw={draw} weight={weight} speed={speed}>
        <ProgressIndicator />
      </ProgressTrack>
    </ProgressPrimitive.Root>
  );
}

type TrackPen = Pick<Pen, "roughness" | "passes" | "radius" | "fill" | "draw" | "weight" | "speed"> & { seed?: string | number };

/** A pill pulled once along the full length; the indicator inside shades it in. */
function ProgressTrack({ className, children, seed, roughness, passes, radius, fill, draw, weight, speed, ...props }: ProgressPrimitive.Track.Props & TrackPen) {
  const pen = usePen({ roughness, passes, radius, fill, draw, weight, speed });
  const s = useInkSeed(seed);
  const { ref, w, h, frame } = useInkFrame([320, 12], { pad: 5 });
  const r = pen.radius === undefined || pen.radius === "full" ? h / 2 : Math.min(pen.radius, h / 2);
  const outline = useMemo(
    () => penBoxStrokes(s, w, h, { roughness: pen.roughness ?? 1, passes: pen.passes ?? 1, corners: "joined", radius: r }),
    [s, w, h, pen.roughness, pen.passes, r],
  );
  const mode = pen.draw ?? "auto";
  const track = useMemo(() => ({ w, h, r, s, pen }), [w, h, r, s, pen]);
  return (
    <ProgressPrimitive.Track data-slot="progress-track" className={inkClassName("relative flex h-3 w-full items-center", className)} {...props}>
      <InkSvg ref={ref} {...frame} pending={mode === "auto"} className="text-ink-line" style={{ ...frame.style, ...penStyle(pen) }}>
        {outline.map((d, i) => (
          <Stroke key={i} d={d} draw={mode} delay={i * 240} duration={520} width={[1.3, 1, 0.9][i]} opacity={[1, 0.7, 0.5][i]} />
        ))}
      </InkSvg>
      {/* The indicator moves inside a clip shaped like the track, so the
          shading (and the indeterminate patch sliding in and out) never
          spills past it. The track itself can't clip: its outline overshoots. */}
      <div data-slot="progress-clip" className="absolute inset-0 overflow-hidden" style={{ borderRadius: r }}>
        <TrackContext value={track}>{children}</TrackContext>
      </div>
    </ProgressPrimitive.Track>
  );
}

/**
 * The done part, shaded in. The shading is drawn once for the whole track
 * and the indicator only uncovers it, so the strokes hold still as the value
 * grows. Indeterminate progress slides a patch of shading along.
 */
function ProgressIndicator({ className, style, ...props }: ProgressPrimitive.Indicator.Props) {
  const track = useContext(TrackContext);
  // Rounded like the track, so the shading ends in a pill, not a cut.
  const round = track ? { borderRadius: track.r } : undefined;
  return (
    <ProgressPrimitive.Indicator
      data-slot="progress-indicator"
      style={typeof style === "function" ? (state) => ({ ...round, ...style(state) }) : { ...round, ...style }}
      className={inkClassName(
        cn(
          // .ink-progress (base.css) slides it along when indeterminate.
          "ink-progress absolute inset-y-0 left-0 overflow-hidden transition-[width] duration-(--dur-state) ease-out motion-reduce:transition-none",
        ),
        className,
      )}
      {...props}
    >
      {track && <Shading {...track} />}
    </ProgressPrimitive.Indicator>
  );
}

function Shading({ w, h, r, s, pen }: TrackInk) {
  const id = useId().replace(/[^\w-]/g, "");
  const fill: InkFill = pen.fill ?? "shade";
  const d = useMemo(() => {
    if (fill === "flat") return "";
    if (fill === "hatch") return hatchStrokes(s + 30, w, h, { gap: 2.4, angle: -50, jitter: 0.3 }).join("");
    if (fill === "scribble") return scribbleFill(s + 30, w, h, { gap: 2.2 });
    return shadeFill(s + 30, w, h, { gap: 1.8, angle: -10, overrun: 2 });
  }, [fill, s, w, h]);
  return (
    <InkSvg box={[0, 0, w, h]} className="top-0 left-0 text-ink" style={{ width: w, height: h, ...penStyle(pen) } as CSSProperties}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={roundedRectPath(w, h, r)} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>{d ? <Stroke d={d} width={1.2} /> : <path d={roundedRectPath(w, h, r)} className="ink-fill" style={{ opacity: 1 }} />}</g>
    </InkSvg>
  );
}

function ProgressLabel({ className, ...props }: ProgressPrimitive.Label.Props) {
  return <ProgressPrimitive.Label className={inkClassName("text-base", className)} data-slot="progress-label" {...props} />;
}

function ProgressValue({ className, ...props }: ProgressPrimitive.Value.Props) {
  return <ProgressPrimitive.Value className={inkClassName("ml-auto text-sm text-ink-3 tabular-nums", className)} data-slot="progress-value" {...props} />;
}

export { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue };
