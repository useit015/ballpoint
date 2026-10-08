"use client";

import type { ComponentProps } from "react";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";
import { usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { inkClassName, inkRules, inkWash } from "@/registry/ballpoint/lib/ink";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import { InkPanel } from "@/registry/ballpoint/lib/ink-panel";

// Every row: the highlighted one is shaded in with a quick pass of the pen,
// a patch of shading (inkWash) masking a pseudo-element in the row's own
// colour, so a destructive row is shaded in red.
const itemClass = cn(
  "relative isolate flex cursor-default items-center gap-2 px-2.5 py-1 text-base outline-none select-none data-inset:pl-9",
  "before:pointer-events-none before:absolute before:inset-x-0.5 before:inset-y-0 before:-z-10 before:bg-current before:opacity-0 before:transition-opacity before:duration-(--dur-press)",
  "before:[mask-image:var(--ink-wash-1)] before:[mask-size:100%_100%] before:[mask-repeat:no-repeat] nth-[3n+2]:before:[mask-image:var(--ink-wash-2)] nth-[3n]:before:[mask-image:var(--ink-wash-3)]",
  "data-highlighted:before:opacity-(--ink-wash-opacity) [--ink-wash-opacity:0.13]",
  "data-disabled:pointer-events-none data-disabled:opacity-50",
  "[&_svg:not(.ink-sketch)]:pointer-events-none [&_svg:not(.ink-sketch)]:shrink-0 [&_svg:not(.ink-sketch):not([class*='size-'])]:size-4",
);

function DropdownMenu({ ...props }: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}

function DropdownMenuPortal({ ...props }: MenuPrimitive.Portal.Props) {
  return <MenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}

function DropdownMenuTrigger({ ...props }: MenuPrimitive.Trigger.Props) {
  return <MenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}

/**
 * A slip of paper of choices, pencilled round and lifted off its shadow.
 * Long menus scroll inside the slip, so the drawing is never cut off.
 */
function DropdownMenuContent({
  align = "start",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 6,
  className,
  style,
  children,
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
}: MenuPrimitive.Popup.Props &
  Pick<MenuPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset"> &
  Omit<Pen, "fill"> & { seed?: string | number }) {
  const pen = usePen({ roughness, passes, radius, corners, shadow, draw, weight, speed });
  const marks = { ...inkWash, ...inkRules };
  return (
    <MenuPrimitive.Portal>
      <MenuPrimitive.Positioner className="isolate z-50 outline-none" align={align} alignOffset={alignOffset} side={side} sideOffset={sideOffset}>
        <MenuPrimitive.Popup
          data-slot="dropdown-menu-content"
          className={inkClassName(
            "ink-paper relative isolate w-max min-w-[max(11rem,var(--anchor-width))] max-w-(--available-width) origin-(--transform-origin) text-popover-foreground outline-none",
            "transition-[opacity,scale] duration-(--dur-hover) ease-out data-starting-style:opacity-0 data-ending-style:opacity-0 data-ending-style:ease-in",
            "motion-safe:data-starting-style:scale-[0.97] motion-safe:data-ending-style:scale-[0.98]",
            className,
          )}
          style={typeof style === "function" ? (state) => ({ ...marks, ...style(state) }) : { ...marks, ...style }}
          {...props}
        >
          <InkPanel pen={pen} seed={seed} estimate={[200, 180]} offset={5} maxRadius={12} className="text-ink-3" />
          <div data-slot="dropdown-menu-list" className="max-h-[calc(var(--available-height)-1rem)] overflow-y-auto overscroll-contain p-1.5">
            {children}
          </div>
        </MenuPrimitive.Popup>
      </MenuPrimitive.Positioner>
    </MenuPrimitive.Portal>
  );
}

function DropdownMenuGroup({ ...props }: MenuPrimitive.Group.Props) {
  return <MenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}

function DropdownMenuLabel({ className, inset, ...props }: MenuPrimitive.GroupLabel.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.GroupLabel
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={inkClassName("px-2.5 pt-1.5 pb-1 text-sm text-ink-3 data-inset:pl-9", className)}
      {...props}
    />
  );
}

function DropdownMenuItem({ className, inset, variant = "default", ...props }: MenuPrimitive.Item.Props & { inset?: boolean; variant?: "default" | "destructive" }) {
  return (
    <MenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={inkClassName(itemClass, "data-[variant=destructive]:text-destructive", className)}
      {...props}
    />
  );
}

function DropdownMenuSub({ ...props }: MenuPrimitive.SubmenuRoot.Props) {
  return <MenuPrimitive.SubmenuRoot data-slot="dropdown-menu-sub" {...props} />;
}

function DropdownMenuSubTrigger({ className, inset, children, ...props }: MenuPrimitive.SubmenuTrigger.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.SubmenuTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={inkClassName(itemClass, "data-popup-open:before:opacity-(--ink-wash-opacity)", className)}
      {...props}
    >
      {children}
      <InkGlyph name="chevron-right" className="ml-auto size-3.5 text-ink-3 rtl:-scale-x-100" />
    </MenuPrimitive.SubmenuTrigger>
  );
}

function DropdownMenuSubContent({ align = "start", alignOffset = -6, side = "right", sideOffset = 2, className, ...props }: ComponentProps<typeof DropdownMenuContent>) {
  return (
    <DropdownMenuContent
      data-slot="dropdown-menu-sub-content"
      className={cn("min-w-36", className)}
      align={align}
      alignOffset={alignOffset}
      side={side}
      sideOffset={sideOffset}
      {...props}
    />
  );
}

/** Checking it ticks it, the pen running up and out; unchecking pulls the tick back out. */
function DropdownMenuCheckboxItem({ className, children, inset, ...props }: MenuPrimitive.CheckboxItem.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.CheckboxItem data-slot="dropdown-menu-checkbox-item" data-inset={inset} className={inkClassName(itemClass, "pr-9", className)} {...props}>
      {children}
      <MenuPrimitive.CheckboxItemIndicator
        keepMounted
        data-slot="dropdown-menu-checkbox-item-indicator"
        className="pointer-events-none absolute right-2.5 flex size-4 items-center justify-center"
      >
        <InkGlyph name="check" draw="checked" />
      </MenuPrimitive.CheckboxItemIndicator>
    </MenuPrimitive.CheckboxItem>
  );
}

function DropdownMenuRadioGroup({ ...props }: MenuPrimitive.RadioGroup.Props) {
  return <MenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}

/** The chosen one gets a dot scribbled in beside it. */
function DropdownMenuRadioItem({ className, children, inset, ...props }: MenuPrimitive.RadioItem.Props & { inset?: boolean }) {
  return (
    <MenuPrimitive.RadioItem data-slot="dropdown-menu-radio-item" data-inset={inset} className={inkClassName(itemClass, "pr-9", className)} {...props}>
      {children}
      <MenuPrimitive.RadioItemIndicator
        keepMounted
        data-slot="dropdown-menu-radio-item-indicator"
        className="pointer-events-none absolute right-2.5 flex size-4 items-center justify-center"
      >
        <InkGlyph name="dot" draw="checked" />
      </MenuPrimitive.RadioItemIndicator>
    </MenuPrimitive.RadioItem>
  );
}

/** A short rule drawn across the slip (see inkRules). */
function DropdownMenuSeparator({ className, ...props }: MenuPrimitive.Separator.Props) {
  return (
    <MenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={inkClassName("mx-1 my-1.5 h-[5px] bg-ink-4 [mask-image:var(--ink-rule-2)] [mask-size:100%_100%] [mask-repeat:no-repeat]", className)}
      {...props}
    />
  );
}

function DropdownMenuShortcut({ className, ...props }: ComponentProps<"span">) {
  return <span data-slot="dropdown-menu-shortcut" className={cn("ml-auto pl-4 text-sm tracking-wide text-ink-3", className)} {...props} />;
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
};
