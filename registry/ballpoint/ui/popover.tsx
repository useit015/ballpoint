"use client";

import type { ComponentProps } from "react";
import { inkClassName } from "@/registry/ballpoint/lib/ink";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { cn } from "@/lib/utils";
import { usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkPanel } from "@/registry/ballpoint/lib/ink-panel";

function Popover({ ...props }: PopoverPrimitive.Root.Props) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}

function PopoverTrigger({ ...props }: PopoverPrimitive.Trigger.Props) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}

/** A slip of paper held up next to its trigger, pencilled round and lifted off its shadow. */
function PopoverContent({
  className,
  children,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 8,
  seed,
  roughness,
  passes,
  radius,
  corners,
  shadow,
  draw,
  weight,
  speed,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<PopoverPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> &
  Omit<Pen, "fill"> & { seed?: string | number }) {
  const pen = usePen({ roughness, passes, radius, corners, shadow, draw, weight, speed });
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset} className="isolate z-50">
        <PopoverPrimitive.Popup
          data-slot="popover-content"
          className={inkClassName(
            cn(
              "ink-paper relative isolate flex w-72 origin-(--transform-origin) flex-col gap-3 p-4 text-base text-popover-foreground outline-none",
              "transition-[opacity,scale] duration-(--dur-hover) ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:ease-in",
              "motion-safe:data-starting-style:scale-[0.97] motion-safe:data-ending-style:scale-[0.98]",
            ),
            className,
          )}
          {...props}
        >
          <InkPanel pen={pen} seed={seed} estimate={[288, 140]} offset={5} className="text-ink-3" />
          {children}
        </PopoverPrimitive.Popup>
      </PopoverPrimitive.Positioner>
    </PopoverPrimitive.Portal>
  );
}

function PopoverHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="popover-header" className={cn("flex flex-col gap-1", className)} {...props} />;
}

function PopoverTitle({ className, ...props }: PopoverPrimitive.Title.Props) {
  return <PopoverPrimitive.Title data-slot="popover-title" className={inkClassName("text-lg leading-snug font-bold", className)} {...props} />;
}

function PopoverDescription({ className, ...props }: PopoverPrimitive.Description.Props) {
  return <PopoverPrimitive.Description data-slot="popover-description" className={inkClassName("text-base text-ink-3", className)} {...props} />;
}

export { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger };
