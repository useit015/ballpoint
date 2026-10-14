"use client";

import { useId, useMemo, type ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { Stroke } from "@/registry/ballpoint/lib/ink";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";
import { hatchStrokes, roundedRectPath } from "@/registry/ballpoint/lib/ink-sketch";

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 px-4 py-3 text-left text-base has-data-[slot=alert-action]:pr-20 has-[>svg:not(.ink-sketch)]:grid-cols-[auto_1fr] has-[>svg:not(.ink-sketch)]:gap-x-3 *:[svg:not(.ink-sketch)]:row-span-2 *:[svg:not(.ink-sketch)]:translate-y-1 *:[svg:not(.ink-sketch)]:text-current *:[svg:not(.ink-sketch):not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "text-card-foreground",
        note: "text-card-foreground",
        destructive: "text-destructive *:data-[slot=alert-description]:text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

/**
 * A note boxed off from the page; the destructive one in red pen. The `note`
 * variant is hatched lightly across, as if highlighted in the margin.
 */
function Alert({
  className,
  variant,
  children,
  seed,
  roughness,
  passes,
  radius,
  corners,
  fill,
  draw,
  weight,
  speed,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof alertVariants> & Omit<Pen, "shadow"> & { seed?: string | number }) {
  const pen = usePen({ roughness, passes, radius, corners, fill, draw, weight, speed });
  return (
    <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      <InkOutline pen={pen} seed={seed} estimate={[480, 72]} maxRadius={18} className={variant === "destructive" ? "text-destructive" : "text-ink-line"}>
        {({ w, h, r, s }) => variant === "note" && <AlertWash w={w} h={h} r={r} s={s} fill={pen.fill ?? "hatch"} draw={pen.draw} />}
      </InkOutline>
      {children}
    </div>
  );
}

/** The note's hatching, kept inside the box. */
function AlertWash({ w, h, r, s, fill, draw }: { w: number; h: number; r: number; s: number; fill: NonNullable<Pen["fill"]>; draw: Pen["draw"] }) {
  const id = useId().replace(/[^\w-]/g, "");
  const d = useMemo(() => (fill === "flat" ? "" : hatchStrokes(s + 30, w, h, { gap: 5.5, angle: -50, jitter: 0.5, inset: 1.5 }).join("")), [fill, s, w, h]);
  return (
    <>
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={roundedRectPath(w, h, r)} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${id}-clip)`}>
        {d ? <Stroke d={d} draw={draw ?? "auto"} delay={200} duration={560} width={0.9} opacity={0.32} /> : <path d={roundedRectPath(w, h, r)} className="ink-fill" style={{ opacity: 0.12 }} />}
      </g>
    </>
  );
}

function AlertTitle({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "relative font-bold group-has-[>svg:not(.ink-sketch)]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3",
        className,
      )}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "relative text-base text-balance text-ink-2 group-has-[>svg:not(.ink-sketch)]/alert:col-start-2 md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4",
        className,
      )}
      {...props}
    />
  );
}

function AlertAction({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="alert-action" className={cn("absolute top-2.5 right-3", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription, AlertAction };
