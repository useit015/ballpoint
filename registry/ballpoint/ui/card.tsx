"use client";

import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";
import { Separator } from "@/registry/ballpoint/ui/separator";

/**
 * A box pencilled around a block of content. The outline is decoration, so
 * it's drawn at a lighter pressure than a control's.
 */
function Card({
  className,
  size = "default",
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
}: ComponentProps<"div"> & Omit<Pen, "fill" | "shadow"> & { size?: "default" | "sm"; seed?: string | number }) {
  const pen = usePen({ roughness, passes, radius, corners, draw, weight, speed });
  return (
    <div
      data-slot="card"
      data-size={size}
      className={cn(
        "group/card relative flex flex-col gap-(--card-spacing) py-(--card-spacing) text-base text-card-foreground [--card-spacing:--spacing(6)] has-data-[slot=card-footer]:pb-0 data-[size=sm]:[--card-spacing:--spacing(4)]",
        className,
      )}
      {...props}
    >
      <InkOutline pen={pen} seed={seed} estimate={[360, 220]} maxRadius={18} className="text-ink-line" />
      {children}
    </div>
  );
}

function CardHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        "group/card-header @container/card-header relative grid auto-rows-min items-start gap-1 px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto]",
        className,
      )}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-title" className={cn("text-xl leading-snug font-bold group-data-[size=sm]/card:text-lg", className)} {...props} />;
}

function CardDescription({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-description" className={cn("text-sm text-ink-3", className)} {...props} />;
}

function CardAction({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-action" className={cn("col-start-2 row-span-2 row-start-1 self-start justify-self-end", className)} {...props} />;
}

function CardContent({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("relative px-(--card-spacing)", className)} {...props} />;
}

/** The footer is ruled off with a pen line rather than tinted. */
function CardFooter({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="card-footer" className={cn("relative flex flex-col", className)} {...props}>
      <div className="px-(--card-spacing)">
        <Separator />
      </div>
      <div className="flex items-center gap-3 p-(--card-spacing)">{children}</div>
    </div>
  );
}

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent };
