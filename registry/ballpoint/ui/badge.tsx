"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { useId, useMemo, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { usePen, type InkFill, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { Stroke } from "@/registry/ballpoint/lib/ink";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";
import { hatchStrokes, roundedRectPath, scribbleFill, shadeFill } from "@/registry/ballpoint/lib/ink-sketch";

const badgeVariants = cva(
  "group/badge relative isolate inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 px-2.5 text-sm whitespace-nowrap [&>svg:not(.ink-sketch)]:pointer-events-none [&>svg:not(.ink-sketch)]:size-3.5",
  {
    variants: {
      variant: {
        default: "text-primary-foreground",
        secondary: "text-foreground",
        destructive: "text-destructive",
        outline: "text-foreground",
        ghost: "ink-hover text-ink-2 [a]:hover:text-ink",
        link: "ink-hover text-foreground",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

type Variant = NonNullable<VariantProps<typeof badgeVariants>["variant"]>;

/**
 * A word circled or coloured in: a small pill pulled once around the text,
 * shaded solid for the default badge, hatched for secondary, red for
 * destructive. Renders a <span>; pass `render` to make it a link.
 */
function Badge({
  className,
  variant = "default",
  render,
  children,
  seed,
  roughness,
  radius,
  fill,
  draw,
  weight,
  speed,
  ...props
}: useRender.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> &
  Pick<Pen, "roughness" | "radius" | "fill" | "draw" | "weight" | "speed"> & { seed?: string | number }) {
  const pen = usePen({ roughness, radius: radius ?? "full", fill, draw, weight, speed, passes: 1, corners: "joined" });
  const v = variant ?? "default";
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      // Data attributes are fine on a span; the object literal type just doesn't list them.
      {
        "data-slot": "badge",
        "data-variant": v,
        className: cn(badgeVariants({ variant: v }), className),
        children: (
          <>
            <BadgeInk variant={v} pen={pen} seed={seed} />
            {children}
          </>
        ),
      } as ComponentProps<"span">,
      props,
    ),
    render,
    state: { slot: "badge", variant: v },
  });
}

function BadgeInk({ variant, pen, seed }: { variant: Variant; pen: Pen; seed?: string | number }) {
  const id = useId().replace(/[^\w-]/g, "");
  if (variant === "link") return null;
  const solid = variant === "default";
  const filled = solid || variant === "secondary";
  return (
    <InkOutline
      pen={variant === "ghost" ? { ...pen, draw: "none" } : pen}
      seed={seed}
      estimate={[64, 24]}
      pad={6}
      className={cn("-z-10", variant === "ghost" && "opacity-0 transition-opacity group-hover/badge:opacity-100", solid && "text-primary")}
    >
      {({ w, h, r, s }) =>
        filled && (
          <>
            <defs>
              <clipPath id={`${id}-clip`}>
                <path d={roundedRectPath(w, h, r)} />
              </clipPath>
            </defs>
            {solid && <path d={roundedRectPath(w, h, r)} className="ink-fill" />}
            <g clipPath={`url(#${id}-clip)`}>
              <BadgeFill fill={pen.fill ?? (solid ? "shade" : "hatch")} solid={solid} s={s} w={w} h={h} draw={pen.draw} />
            </g>
          </>
        )
      }
    </InkOutline>
  );
}

function BadgeFill({ fill, solid, s, w, h, draw }: { fill: InkFill; solid: boolean; s: number; w: number; h: number; draw: Pen["draw"] }) {
  const d = useMemo(() => {
    if (fill === "flat") return "";
    if (fill === "hatch") return hatchStrokes(s + 30, w, h, { gap: solid ? 2.4 : 3.6, angle: -50, jitter: 0.3 }).join("");
    if (fill === "scribble") return scribbleFill(s + 30, w, h, { gap: solid ? 2.2 : 3.4 });
    return shadeFill(s + 30, w, h, { gap: solid ? 2 : 3.4, angle: -12, overrun: 2 });
  }, [fill, solid, s, w, h]);
  if (!d) return solid ? null : <path d={roundedRectPath(w, h, h / 2)} className="ink-fill" style={{ opacity: 0.14 }} />;
  return <Stroke d={d} draw={draw ?? "auto"} delay={150} duration={420} width={solid ? 1.1 : 0.9} opacity={solid ? 1 : 0.45} />;
}

export { Badge, badgeVariants };
