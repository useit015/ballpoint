"use client";

import { useId, useMemo } from "react";
import { Switch as SwitchPrimitive } from "@base-ui/react/switch";
import { cn } from "@/lib/utils";
import { penStyle, useInkSeed, usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { inkClassName, InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";
import { ringStroke, roundedRectPath, scribbleFill, shadeFill, hatchStrokes } from "@/registry/ballpoint/lib/ink-sketch";

const sizes = {
  default: { w: 44, h: 24, thumb: 18 },
  sm: { w: 32, h: 18, thumb: 12 },
} as const;

/**
 * A pill drawn in one pull with a ring for a thumb. Switching on shades the
 * track in with the pen as the thumb slides across; switching off pulls the
 * shading back out.
 */
function Switch({
  className,
  size = "default",
  seed,
  roughness,
  passes,
  fill,
  draw,
  weight,
  speed,
  ...props
}: SwitchPrimitive.Root.Props &
  Pick<Pen, "roughness" | "passes" | "fill" | "draw" | "weight" | "speed"> & { size?: keyof typeof sizes; seed?: string | number }) {
  const pen = usePen({ roughness, passes, fill, draw, weight, speed });
  const uid = useId().replace(/[^\w-]/g, "");
  const { w, h, thumb } = sizes[size];
  const fillStyle = pen.fill ?? "shade";
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={inkClassName(
        cn(
          "peer group/switch relative inline-flex shrink-0 cursor-pointer items-center rounded-full outline-none",
          "after:absolute after:-inset-x-3 after:-inset-y-2",
          "text-ink-3 transition-colors duration-(--dur-hover) not-data-checked:hover:text-ink data-checked:text-ink",
          "aria-invalid:text-destructive data-invalid:text-destructive",
          "focus-visible:outline-solid focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-ring",
          "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        ),
        className,
      )}
      style={{ width: w, height: h }}
      {...props}
    >
      <InkOutline pen={{ ...pen, radius: "full", corners: "joined" }} seed={seed} estimate={[w, h]} pad={6}>
        {({ w: tw, h: th, s }) => (
          <>
            <defs>
              <clipPath id={`${uid}-track`}>
                <path d={roundedRectPath(tw, th, th / 2)} />
              </clipPath>
            </defs>
            <g clipPath={`url(#${uid}-track)`}>
              <TrackFill fill={fillStyle} s={s} w={tw} h={th} />
            </g>
          </>
        )}
      </InkOutline>
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none absolute left-[3px] block text-ink transition-transform duration-(--dur-state) ease-out data-checked:translate-x-(--on) motion-reduce:transition-none"
        style={{ top: (h - thumb) / 2, width: thumb, height: thumb, ["--on" as string]: `${w - thumb - 6}px` }}
      >
        <ThumbInk seed={seed} size={thumb} pen={pen} />
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

/** The track's colouring-in, drawn while the switch is on. */
function TrackFill({ fill, s, w, h }: { fill: NonNullable<Pen["fill"]>; s: number; w: number; h: number }) {
  const strokes = useMemo(() => {
    if (fill === "flat") return [];
    if (fill === "hatch") return [hatchStrokes(s + 50, w, h, { gap: 2.4, angle: -50, jitter: 0.3 }).join("")];
    if (fill === "scribble") return [scribbleFill(s + 50, w, h, { gap: 2.2 })];
    return [shadeFill(s + 50, w, h, { gap: 1.9, angle: -12, overrun: 2 })];
  }, [fill, s, w, h]);
  // Flat: one stroke as wide as the track, pulled left to right.
  if (fill === "flat") return <Stroke d={`M${h / 2} ${h / 2}H${w - h / 2}`} draw="checked" duration={260} width={h} />;
  return strokes.map((d, i) => <Stroke key={i} d={d} draw="checked" duration={420} width={1.3} />);
}

/** A small paper disc with a drawn ring, so the shaded track doesn't show through. */
function ThumbInk({ seed, size, pen }: { seed?: string | number; size: number; pen: Pen }) {
  const s = useInkSeed(seed === undefined ? undefined : `${seed}-thumb`);
  const ring = useMemo(() => ringStroke(s + 60, size, { turns: 1.08 }), [s, size]);
  return (
    <InkSvg box={[-2, -2, size + 4, size + 4]} className="inset-[-2px]" style={{ width: size + 4, height: size + 4, ...penStyle(pen) }}>
      <circle cx={size / 2} cy={size / 2} r={size / 2} style={{ fill: "var(--paper)" }} />
      <Stroke d={ring} width={1.4} />
    </InkSvg>
  );
}

export { Switch };
