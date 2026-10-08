"use client";

import type { ComponentProps } from "react";
import { inkClassName } from "@/registry/ballpoint/lib/ink";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { cn } from "@/lib/utils";
import { usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";
import { InkPanel } from "@/registry/ballpoint/lib/ink-panel";
import { Button } from "@/registry/ballpoint/ui/button";

function AlertDialog({ ...props }: AlertDialogPrimitive.Root.Props) {
  return <AlertDialogPrimitive.Root data-slot="alert-dialog" {...props} />;
}

function AlertDialogTrigger({ ...props }: AlertDialogPrimitive.Trigger.Props) {
  return <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />;
}

function AlertDialogPortal({ ...props }: AlertDialogPrimitive.Portal.Props) {
  return <AlertDialogPrimitive.Portal data-slot="alert-dialog-portal" {...props} />;
}

/** Tracing paper over the page: it dims and softens what's underneath. */
function AlertDialogOverlay({ className, ...props }: AlertDialogPrimitive.Backdrop.Props) {
  return (
    <AlertDialogPrimitive.Backdrop
      data-slot="alert-dialog-overlay"
      className={inkClassName(
        cn(
          "fixed inset-0 z-50 bg-paper/65 backdrop-blur-[1.5px] transition-opacity duration-(--dur-state) ease-out",
          "data-ending-style:opacity-0 data-ending-style:ease-in data-starting-style:opacity-0",
          "supports-[-webkit-touch-callout:none]:absolute",
        ),
        className,
      )}
      {...props}
    />
  );
}

/**
 * A note that needs an answer before you go on: a sheet laid over the page,
 * like Dialog, without a close button. Pair a Cancel with the Action.
 */
function AlertDialogContent({
  className,
  size = "default",
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
}: AlertDialogPrimitive.Popup.Props & Omit<Pen, "fill"> & { size?: "default" | "sm"; seed?: string | number }) {
  const pen = usePen({ roughness, passes, radius, corners, shadow, draw, weight, speed });
  return (
    <AlertDialogPortal>
      <AlertDialogOverlay />
      <AlertDialogPrimitive.Viewport data-slot="alert-dialog-viewport" className="fixed inset-0 z-50 flex items-center justify-center p-5">
        <AlertDialogPrimitive.Popup
          data-slot="alert-dialog-content"
          data-size={size}
          className={inkClassName(
            cn(
              "group/alert-dialog-content ink-paper relative isolate grid w-full gap-5 p-6 text-base text-popover-foreground outline-none data-[size=default]:max-w-md data-[size=sm]:max-w-xs",
              "transition-[opacity,translate,rotate] duration-(--dur-enter) ease-out-expo data-starting-style:opacity-0 data-ending-style:opacity-0",
              "motion-safe:data-starting-style:translate-y-3 motion-safe:data-starting-style:rotate-1",
              "data-ending-style:duration-(--dur-state) data-ending-style:ease-in motion-safe:data-ending-style:translate-y-1.5",
            ),
            className,
          )}
          {...props}
        >
          <InkPanel pen={pen} seed={seed} estimate={size === "sm" ? [320, 220] : [448, 200]} offset={7} className="text-ink-3" />
          {children}
        </AlertDialogPrimitive.Popup>
      </AlertDialogPrimitive.Viewport>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-header"
      className={cn(
        "grid grid-rows-[auto_1fr] place-items-center gap-1.5 text-center has-data-[slot=alert-dialog-media]:grid-rows-[auto_auto_1fr] has-data-[slot=alert-dialog-media]:gap-x-4",
        "sm:group-data-[size=default]/alert-dialog-content:place-items-start sm:group-data-[size=default]/alert-dialog-content:text-left sm:group-data-[size=default]/alert-dialog-content:has-data-[slot=alert-dialog-media]:grid-rows-[auto_1fr]",
        className,
      )}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-3 pt-1 group-data-[size=sm]/alert-dialog-content:grid group-data-[size=sm]/alert-dialog-content:grid-cols-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    />
  );
}

/** An icon in a ring drawn round it, beside the title. */
function AlertDialogMedia({ className, children, seed, ...props }: ComponentProps<"div"> & { seed?: string | number }) {
  const pen = usePen({});
  return (
    <div
      data-slot="alert-dialog-media"
      className={cn(
        "relative mb-2 inline-flex size-11 items-center justify-center text-ink sm:group-data-[size=default]/alert-dialog-content:row-span-2 *:[svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...props}
    >
      <InkOutline pen={pen} seed={seed} shape="ring" estimate={[44, 44]} pad={6} passes={1} className="text-ink-line" />
      {children}
    </div>
  );
}

function AlertDialogTitle({ className, ...props }: AlertDialogPrimitive.Title.Props) {
  return (
    <AlertDialogPrimitive.Title
      data-slot="alert-dialog-title"
      className={inkClassName("text-xl leading-snug font-bold sm:group-data-[size=default]/alert-dialog-content:group-has-data-[slot=alert-dialog-media]/alert-dialog-content:col-start-2", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({ className, ...props }: AlertDialogPrimitive.Description.Props) {
  return (
    <AlertDialogPrimitive.Description
      data-slot="alert-dialog-description"
      className={inkClassName("text-base text-balance text-ink-3 md:text-pretty *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-ink", className)}
      {...props}
    />
  );
}

function AlertDialogAction({ className, ...props }: ComponentProps<typeof Button>) {
  return <Button data-slot="alert-dialog-action" className={className} {...props} />;
}

function AlertDialogCancel({
  className,
  variant = "outline",
  size = "default",
  seed,
  ...props
}: AlertDialogPrimitive.Close.Props & Pick<ComponentProps<typeof Button>, "variant" | "size" | "seed">) {
  return <AlertDialogPrimitive.Close data-slot="alert-dialog-cancel" className={className} render={<Button variant={variant} size={size} seed={seed} />} {...props} />;
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
