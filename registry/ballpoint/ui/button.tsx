"use client";

import { Children, useId, useMemo, type ReactNode } from "react";
import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useInkFrame, type InkSize } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke, type DrawMode } from "@/registry/ballpoint/lib/ink";
import {
  boxStroke,
  cornerTicks,
  crossedBoxStroke,
  hashSeed,
  hatchStrokes,
  linkStroke,
  shadeFill,
} from "@/registry/ballpoint/lib/ink-sketch";

const buttonVariants = cva(
  [
    "group/button ink-hover relative isolate inline-flex shrink-0 cursor-pointer items-center justify-center whitespace-nowrap select-none",
    "transition-[translate,color] duration-(--dur-hover) ease-out",
    "outline-none focus-visible:outline-solid focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-ring focus-visible:[border-radius:var(--hand-radius)]",
    "disabled:pointer-events-none disabled:opacity-50 data-disabled:pointer-events-none data-disabled:opacity-50",
    "[&_svg:not(.ink-sketch)]:pointer-events-none [&_svg:not(.ink-sketch)]:shrink-0",
    "motion-reduce:transition-none",
  ],
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        outline: "text-foreground",
        secondary: "text-foreground",
        ghost: "text-ink-2 hover:text-ink focus-visible:text-ink aria-expanded:text-ink",
        destructive: "text-destructive",
        link: "text-foreground",
      },
      size: {
        default: "h-10 gap-1.5 px-4 text-base [&_svg:not(.ink-sketch):not([class*='size-'])]:size-4.5",
        xs: "h-7 gap-1 px-2 text-xs [&_svg:not(.ink-sketch):not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1 px-3 text-sm [&_svg:not(.ink-sketch):not([class*='size-'])]:size-4",
        lg: "h-12 gap-2 px-5 text-lg [&_svg:not(.ink-sketch):not([class*='size-'])]:size-5",
        icon: "size-10 [&_svg:not(.ink-sketch):not([class*='size-'])]:size-4.5",
        "icon-xs": "size-7 [&_svg:not(.ink-sketch):not([class*='size-'])]:size-3.5",
        "icon-sm": "size-8 [&_svg:not(.ink-sketch):not([class*='size-'])]:size-4",
        "icon-lg": "size-12 [&_svg:not(.ink-sketch):not([class*='size-'])]:size-5",
      },
    },
    compoundVariants: [
      // Boxed buttons lift off a hatched shadow on hover and focus; pressing
      // flattens them back onto the paper.
      {
        variant: ["default", "outline", "secondary", "destructive"],
        className:
          "hover:-translate-[1.5px] focus-visible:-translate-[1.5px] active:translate-0 active:duration-(--dur-press)",
      },
      { variant: "link", className: "h-auto px-0.5" },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

type Variant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;
type Size = NonNullable<VariantProps<typeof buttonVariants>["size"]>;

const metrics: Record<Size, { h: number; font: number; pad: number }> = {
  default: { h: 40, font: 20, pad: 16 },
  xs: { h: 28, font: 15, pad: 8 },
  sm: { h: 32, font: 17, pad: 12 },
  lg: { h: 48, font: 22, pad: 20 },
  icon: { h: 40, font: 20, pad: 0 },
  "icon-xs": { h: 28, font: 15, pad: 0 },
  "icon-sm": { h: 32, font: 17, pad: 0 },
  "icon-lg": { h: 48, font: 22, pad: 0 },
};

function textLength(node: ReactNode): number {
  let n = 0;
  Children.forEach(node, (child) => {
    if (typeof child === "string" || typeof child === "number") n += String(child).length;
  });
  return n;
}

/** A first guess at the button's box, for the server render (measured on the client). */
function estimateSize(children: ReactNode, size: Size): InkSize {
  const { h, font, pad } = metrics[size];
  if (size.startsWith("icon")) return [h, h];
  return [Math.round(textLength(children) * font * 0.46 + pad * 2), h];
}

function Button({
  className,
  variant = "default",
  size = "default",
  seed,
  draw = "none",
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    /** Pins the drawing; by default each button gets its own wobble. */
    seed?: string | number;
    /** "mount" draws the box in when the button first renders. */
    draw?: Exclude<DrawMode, "hover">;
  }) {
  const v = variant ?? "default";
  const sz = size ?? "default";
  return (
    <ButtonPrimitive data-slot="button" data-variant={v} className={cn(buttonVariants({ variant: v, size: sz, className }))} {...props}>
      <ButtonInk variant={v} seed={seed} draw={draw} estimate={estimateSize(children, sz)} />
      {children}
    </ButtonPrimitive>
  );
}

type ButtonPaths = {
  body?: string;
  passes?: string[];
  shadow?: string;
  ticks?: string;
  shade?: string[];
  hatch?: string;
  ghost?: string;
  underline?: string[];
};

// Paths depend only on (variant, seed, size), and the same button is drawn
// again on every re-render and remount, so recent ones are kept.
const pathCache = new Map<string, ButtonPaths>();

/** Only the strokes this variant shows: shading and hatching are the expensive ones. */
function buttonPaths(variant: Variant, s: number, w: number, h: number): ButtonPaths {
  const key = `${variant}|${s}|${w}|${h}`;
  const hit = pathCache.get(key);
  if (hit) return hit;

  // Small buttons get shorter overshoots, so the corners stay neat.
  const k = Math.min(1, h / 40);
  let paths: ButtonPaths;
  if (variant === "link") {
    paths = { underline: [linkStroke(s + 10, w), linkStroke(s + 11, w)] };
  } else if (variant === "ghost") {
    paths = { ghost: boxStroke(s + 8, w, h, { overshoot: 2.4 * k, jitter: 1.1, bow: 1.3 }) };
  } else {
    paths = {
      body: `${boxStroke(s + 7, w, h, { overshoot: 0, jitter: 0.9 })}Z`,
      passes: [
        crossedBoxStroke(s, w, h, { overshoot: 4 * k }),
        crossedBoxStroke(s + 1, w, h, { overshoot: 7 * k, jitter: 1.6, shift: [1.8 * k, -1.6 * k] }),
        // Secondary is gone over twice, not three times: its hatching carries it.
        ...(variant === "secondary" ? [] : [crossedBoxStroke(s + 2, w, h, { overshoot: 5 * k, jitter: 1.8, shift: [-1.4 * k, 2.2 * k] })]),
      ],
      shadow: crossedBoxStroke(s + 9, w, h, { overshoot: 2 * k, jitter: 1 }),
    };
    if (variant === "default") {
      paths.shade = [shadeFill(s + 3, w, h, { gap: 2.3, angle: -14 }), shadeFill(s + 4, w, h, { gap: 4.2, angle: -26 })];
    } else if (variant === "secondary") {
      paths.hatch = hatchStrokes(s + 6, w, h, { gap: 4.6, angle: -50, jitter: 0.5, inset: 1.5 }).join("");
    } else {
      paths.ticks = cornerTicks(s + 5, w, h, { count: Math.max(3, Math.round(5 * k)), len: 7 * k });
    }
  }

  if (pathCache.size >= 500) pathCache.delete(pathCache.keys().next().value!);
  pathCache.set(key, paths);
  return paths;
}

/** The drawn part of a button, regenerated to the button's real size. */
function ButtonInk({
  variant,
  seed,
  draw,
  estimate,
}: {
  variant: Variant;
  seed?: string | number;
  draw: Exclude<DrawMode, "hover">;
  estimate: InkSize;
}) {
  const uid = useId();
  const id = uid.replace(/[^\w-]/g, "");
  const s = hashSeed(seed ?? uid);
  const { ref, w, h, frame } = useInkFrame(estimate);
  const paths = useMemo(() => buttonPaths(variant, s, w, h), [variant, s, w, h]);
  const at = (delay: number) => ({ draw, delay });

  if (paths.underline) {
    return (
      <InkSvg ref={ref} box={[0, -2, w, 6]} stretch className="-z-10 inset-x-0 top-full -mt-1 h-1.5 w-full">
        {/* Lightly underlined at rest, inked over on hover. */}
        <Stroke d={paths.underline[0]} {...at(0)} duration={320} width={1.4} opacity={0.5} />
        <Stroke d={paths.underline[1]} draw="hover" duration={280} width={1.5} />
      </InkSvg>
    );
  }

  if (paths.ghost) {
    return (
      <InkSvg ref={ref} {...frame} className="-z-10">
        <Stroke d={paths.ghost} draw="hover" duration={340} width={1.2} />
      </InkSvg>
    );
  }

  const { body = "", passes = [], shadow, shade, hatch, ticks } = paths;
  const { box } = frame;
  return (
    // A shaded face is drawn in ink; its label is paper-coloured.
    <InkSvg ref={ref} {...frame} className={cn("-z-10", shade && "text-primary")}>
      <defs>
        <pattern id={`${id}-hatch`} patternUnits="userSpaceOnUse" width={3.2} height={3.2} patternTransform="rotate(-45)">
          <path d="M0 -1V4.2" style={{ strokeWidth: 1.05 }} />
        </pattern>
        {/* The shadow is masked out under the face rather than covered by
            it, so the face stays the paper itself. */}
        <mask id={`${id}-under`} maskUnits="userSpaceOnUse" x={box[0] - 20} y={box[1] - 20} width={box[2] + 40} height={box[3] + 40}>
          <rect x={box[0] - 20} y={box[1] - 20} width={box[2] + 40} height={box[3] + 40} fill="#fff" />
          <path d={body} style={{ fill: "#000", stroke: "#000", strokeWidth: 1.5 }} />
        </mask>
        {(shade || hatch) && (
          <clipPath id={`${id}-clip`}>
            <rect x={-1.5} y={-1.5} width={w + 3} height={h + 3} rx={1.5} />
          </clipPath>
        )}
      </defs>

      <g mask={`url(#${id}-under)`}>
        <g
          className={cn(
            "opacity-0 transition-[translate,opacity] duration-(--dur-hover) ease-out motion-reduce:transition-none",
            "group-hover/button:translate-[5px] group-hover/button:opacity-100",
            "group-focus-visible/button:translate-[5px] group-focus-visible/button:opacity-100",
            "group-active/button:translate-0 group-active/button:duration-(--dur-press)",
          )}
        >
          <path d={body} style={{ fill: `url(#${id}-hatch)`, stroke: "none" }} />
          <path d={shadow} style={{ strokeWidth: 1 }} />
        </g>
      </g>

      {shade && (
        <>
          {/* Shaded solid with the pen; the shading reads through the fill. */}
          <path d={body} className="ink-fill" />
          <g clipPath={`url(#${id}-clip)`}>
            <Stroke d={shade[0]} {...at(120)} duration={620} width={1.2} />
            <Stroke d={shade[1]} {...at(300)} duration={520} width={1} opacity={0.7} />
          </g>
        </>
      )}
      {hatch && (
        <g clipPath={`url(#${id}-clip)`}>
          <Stroke d={hatch} {...at(200)} duration={480} width={0.9} opacity={0.45} />
        </g>
      )}

      {/* Passes that never quite line up, each running past its corners,
          the way a box gets gone over when it matters. */}
      {passes.map((d, i) => (
        <Stroke
          key={i}
          d={d}
          {...at([0, 300, 520][i])}
          duration={[480, 420, 380][i]}
          width={[1.4, 1.1, 1][i]}
          opacity={i === 0 ? undefined : hatch ? 0.6 : [1, 0.8, 0.55][i]}
        />
      ))}
      {ticks && <Stroke d={ticks} {...at(760)} duration={260} width={1} opacity={0.7} />}
    </InkSvg>
  );
}

export { Button, buttonVariants };
