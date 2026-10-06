"use client";

import { useMemo } from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { penStyle, useInkFrame, useInkSeed, usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { linkStroke, penBoxStrokes } from "@/registry/ballpoint/lib/ink-sketch";

function Tabs({ className, orientation = "horizontal", ...props }: TabsPrimitive.Root.Props) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      orientation={orientation}
      className={cn("group/tabs flex gap-4 data-[orientation=horizontal]:flex-col", className)}
      {...props}
    />
  );
}

const tabsListVariants = cva(
  "group/tabs-list relative isolate inline-flex w-fit items-center justify-center gap-1 text-ink-3 group-data-[orientation=vertical]/tabs:h-fit group-data-[orientation=vertical]/tabs:flex-col group-data-[orientation=vertical]/tabs:items-stretch",
  {
    variants: {
      variant: {
        default: "",
        line: "gap-3",
      },
    },
    defaultVariants: { variant: "default" },
  },
);

/**
 * The tab row. The chosen tab is marked by hand: boxed ("default") or
 * underlined ("line"). One mark slides to whichever tab is chosen and is
 * redrawn to fit it.
 */
function TabsList({
  className,
  variant = "default",
  children,
  seed,
  roughness,
  passes,
  radius,
  corners,
  weight,
  speed,
  ...props
}: TabsPrimitive.List.Props & VariantProps<typeof tabsListVariants> & Omit<Pen, "fill" | "shadow" | "draw"> & { seed?: string | number }) {
  const pen = usePen({ roughness, passes, radius, corners, weight, speed });
  return (
    <TabsPrimitive.List data-slot="tabs-list" data-variant={variant} className={cn(tabsListVariants({ variant }), className)} {...props}>
      {children}
      <TabsPrimitive.Indicator
        data-slot="tabs-indicator"
        className="pointer-events-none absolute top-0 left-0 -z-10 h-(--active-tab-height) w-(--active-tab-width) translate-x-(--active-tab-left) translate-y-(--active-tab-top) text-ink transition-[translate,width,height] duration-(--dur-state) ease-out motion-reduce:transition-none"
      >
        <TabMark variant={variant ?? "default"} pen={pen} seed={seed} />
      </TabsPrimitive.Indicator>
    </TabsPrimitive.List>
  );
}

function TabMark({ variant, pen, seed }: { variant: "default" | "line"; pen: Pen; seed?: string | number }) {
  const s = useInkSeed(seed);
  const { ref, w, h, frame } = useInkFrame([96, 36], { pad: 8 });
  const r = pen.radius === "full" ? h / 2 : Math.min(pen.radius ?? 0, h / 2);
  const paths = useMemo(
    () => (variant === "line" ? [linkStroke(s, w)] : penBoxStrokes(s, w, h, { roughness: pen.roughness ?? 1, passes: pen.passes ?? 2, corners: pen.corners ?? "crossed", radius: r })),
    [variant, s, w, h, pen.roughness, pen.passes, pen.corners, r],
  );
  if (variant === "line") {
    return (
      <InkSvg ref={ref} box={[0, -2, w, 6]} stretch className="inset-x-0 top-full -mt-0.5 h-1.5 w-full" style={penStyle(pen)}>
        <Stroke d={paths[0]} width={1.6} />
      </InkSvg>
    );
  }
  return (
    <InkSvg ref={ref} {...frame} style={{ ...frame.style, ...penStyle(pen) }}>
      {paths.map((d, i) => (
        <Stroke key={i} d={d} width={[1.3, 1, 0.9][i]} opacity={[1, 0.7, 0.5][i]} />
      ))}
    </InkSvg>
  );
}

function TabsTrigger({ className, ...props }: TabsPrimitive.Tab.Props) {
  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-9 items-center justify-center gap-1.5 px-3 text-base whitespace-nowrap transition-colors duration-(--dur-hover) outline-none",
        "hover:text-ink-2 data-active:text-ink",
        "focus-visible:outline-solid focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:[border-radius:var(--hand-radius)]",
        "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
        "group-data-[orientation=vertical]/tabs:justify-start group-data-[variant=line]/tabs-list:px-1",
        "[&_svg:not(.ink-sketch)]:pointer-events-none [&_svg:not(.ink-sketch)]:shrink-0 [&_svg:not(.ink-sketch):not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-base outline-none focus-visible:outline-solid focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-ring", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
