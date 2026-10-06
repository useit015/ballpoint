"use client";

import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 px-4 py-3 text-left text-base has-data-[slot=alert-action]:pr-20 has-[>svg:not(.ink-sketch)]:grid-cols-[auto_1fr] has-[>svg:not(.ink-sketch)]:gap-x-3 *:[svg:not(.ink-sketch)]:row-span-2 *:[svg:not(.ink-sketch)]:translate-y-1 *:[svg:not(.ink-sketch)]:text-current *:[svg:not(.ink-sketch):not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "text-card-foreground",
        destructive: "text-destructive *:data-[slot=alert-description]:text-destructive",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

/** A note boxed off from the page; the destructive one in red pen. */
function Alert({
  className,
  variant,
  children,
  seed,
  roughness,
  passes,
  radius,
  corners,
  draw,
  weight,
  speed,
  ...props
}: ComponentProps<"div"> & VariantProps<typeof alertVariants> & Omit<Pen, "fill" | "shadow"> & { seed?: string | number }) {
  const pen = usePen({ roughness, passes, radius, corners, draw, weight, speed });
  return (
    <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      <InkOutline pen={pen} seed={seed} estimate={[480, 72]} maxRadius={18} className={variant === "destructive" ? "text-destructive" : "text-ink-line"} />
      {children}
    </div>
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
