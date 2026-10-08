"use client";

import { Select as SelectPrimitive } from "@base-ui/react/select";
import { cn } from "@/lib/utils";
import { usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { inkClassName, inkRules, inkWash } from "@/registry/ballpoint/lib/ink";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";
import { InkPanel } from "@/registry/ballpoint/lib/ink-panel";

const Select = SelectPrimitive.Root;

function SelectGroup({ className, ...props }: SelectPrimitive.Group.Props) {
  return <SelectPrimitive.Group data-slot="select-group" className={inkClassName("scroll-my-1", className)} {...props} />;
}

function SelectValue({ className, ...props }: SelectPrimitive.Value.Props) {
  return <SelectPrimitive.Value data-slot="select-value" className={inkClassName("flex flex-1 truncate text-left", className)} {...props} />;
}

/**
 * The closed select: a drawn box like an Input's, with a chevron. Focus
 * draws one more pass in full ink; aria-invalid redraws it in red pen.
 */
function SelectTrigger({
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
}: SelectPrimitive.Trigger.Props & Omit<Pen, "fill" | "shadow"> & { size?: "sm" | "default"; seed?: string | number }) {
  const pen = usePen({ roughness, passes, radius, corners, draw, weight, speed });
  return (
    <SelectPrimitive.Trigger
      data-slot="select-trigger"
      data-size={size}
      className={inkClassName(
        cn(
          "group/select-trigger ink-within relative inline-flex w-fit min-w-40 cursor-pointer items-center justify-between gap-2 px-3 text-base whitespace-nowrap text-foreground outline-none select-none",
          "data-[size=default]:h-10 data-[size=sm]:h-8 data-[size=sm]:px-2.5 data-[size=sm]:text-sm data-placeholder:text-ink-3",
          "disabled:cursor-not-allowed disabled:opacity-50 data-disabled:cursor-not-allowed data-disabled:opacity-50",
          "*:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2",
          "[&_svg:not(.ink-sketch)]:pointer-events-none [&_svg:not(.ink-sketch)]:shrink-0 [&_svg:not(.ink-sketch):not([class*='size-'])]:size-4",
        ),
        className,
      )}
      {...props}
    >
      <InkOutline
        pen={pen}
        seed={seed}
        estimate={[160, 40]}
        focusPass
        className={cn(
          "text-ink-3 transition-colors duration-(--dur-hover)",
          "group-hover/select-trigger:text-ink group-data-popup-open/select-trigger:text-ink group-focus-visible/select-trigger:text-ink",
          "group-aria-invalid/select-trigger:text-destructive group-data-invalid/select-trigger:text-destructive",
        )}
      />
      {children}
      <SelectPrimitive.Icon className="flex text-ink-3 transition-transform duration-(--dur-state) ease-out group-data-popup-open/select-trigger:rotate-180 motion-reduce:transition-none">
        <InkGlyph name="chevron-down" className="size-3.5" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );
}

/**
 * The list on a slip of paper, pencilled round and lifted off its shadow.
 * By default it opens over the trigger with the chosen item lined up on it,
 * the way a native select does.
 */
function SelectContent({
  className,
  style,
  children,
  side = "bottom",
  sideOffset = 6,
  align = "center",
  alignOffset = 0,
  alignItemWithTrigger = true,
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
}: SelectPrimitive.Popup.Props &
  Pick<SelectPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger"> &
  Omit<Pen, "fill"> & { seed?: string | number }) {
  const pen = usePen({ roughness, passes, radius, corners, shadow, draw, weight, speed });
  const marks = { ...inkWash, ...inkRules };
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        alignItemWithTrigger={alignItemWithTrigger}
        className="isolate z-50 outline-none select-none"
      >
        <SelectPrimitive.Popup
          data-slot="select-content"
          className={inkClassName(
            cn(
              "ink-paper relative isolate min-w-(--anchor-width) origin-(--transform-origin) text-popover-foreground outline-none data-[side=none]:min-w-[calc(var(--anchor-width)+1rem)]",
              "transition-[opacity,scale] duration-(--dur-hover) ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:ease-in",
              "motion-safe:data-starting-style:scale-[0.97] motion-safe:data-ending-style:scale-[0.98] data-[side=none]:data-starting-style:scale-100",
            ),
            className,
          )}
          style={typeof style === "function" ? (state) => ({ ...marks, ...style(state) }) : { ...marks, ...style }}
          {...props}
        >
          <InkPanel pen={pen} seed={seed} estimate={[180, 200]} offset={5} maxRadius={12} className="text-ink-3" />
          <SelectScrollUpButton />
          <SelectPrimitive.List data-slot="select-list" className="relative max-h-(--available-height) scroll-py-7 overflow-y-auto overscroll-contain p-1.5">
            {children}
          </SelectPrimitive.List>
          <SelectScrollDownButton />
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({ className, ...props }: SelectPrimitive.GroupLabel.Props) {
  return <SelectPrimitive.GroupLabel data-slot="select-label" className={inkClassName("px-2.5 pt-1.5 pb-1 text-sm text-ink-3", className)} {...props} />;
}

/** The highlighted item is shaded in with a quick pass of the pen; the chosen one is ticked. */
function SelectItem({ className, children, ...props }: SelectPrimitive.Item.Props) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={inkClassName(
        cn(
          "relative isolate flex w-full cursor-default items-center gap-2 py-1 pr-9 pl-2.5 text-base outline-none select-none",
          "before:pointer-events-none before:absolute before:inset-x-0.5 before:inset-y-0 before:-z-10 before:bg-current before:opacity-0 before:transition-opacity before:duration-(--dur-press)",
          "before:[mask-image:var(--ink-wash-1)] before:[mask-size:100%_100%] before:[mask-repeat:no-repeat] nth-[3n+2]:before:[mask-image:var(--ink-wash-2)] nth-[3n]:before:[mask-image:var(--ink-wash-3)]",
          "data-highlighted:before:opacity-13",
          "data-disabled:pointer-events-none data-disabled:opacity-50",
          "[&_svg:not(.ink-sketch)]:pointer-events-none [&_svg:not(.ink-sketch)]:shrink-0 [&_svg:not(.ink-sketch):not([class*='size-'])]:size-4",
        ),
        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText className="flex flex-1 shrink-0 items-center gap-2 whitespace-nowrap">{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator data-slot="select-item-indicator" className="pointer-events-none absolute right-2.5 flex size-4 items-center justify-center">
        <InkGlyph name="check" draw="mount" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  );
}

/** A short rule drawn across the slip (see inkRules). */
function SelectSeparator({ className, ...props }: SelectPrimitive.Separator.Props) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={inkClassName("pointer-events-none mx-1 my-1.5 h-[5px] bg-ink-4 [mask-image:var(--ink-rule-2)] [mask-size:100%_100%] [mask-repeat:no-repeat]", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({ className, ...props }: SelectPrimitive.ScrollUpArrow.Props) {
  return (
    <SelectPrimitive.ScrollUpArrow
      data-slot="select-scroll-up-button"
      className={inkClassName("ink-paper absolute inset-x-1 top-1 z-10 flex h-6 cursor-default items-center justify-center text-ink-3", className)}
      {...props}
    >
      <InkGlyph name="chevron-up" className="size-3.5" />
    </SelectPrimitive.ScrollUpArrow>
  );
}

function SelectScrollDownButton({ className, ...props }: SelectPrimitive.ScrollDownArrow.Props) {
  return (
    <SelectPrimitive.ScrollDownArrow
      data-slot="select-scroll-down-button"
      className={inkClassName("ink-paper absolute inset-x-1 bottom-1 z-10 flex h-6 cursor-default items-center justify-center text-ink-3", className)}
      {...props}
    >
      <InkGlyph name="chevron-down" className="size-3.5" />
    </SelectPrimitive.ScrollDownArrow>
  );
}

export { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectScrollDownButton, SelectScrollUpButton, SelectSeparator, SelectTrigger, SelectValue };
