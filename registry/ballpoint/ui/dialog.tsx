"use client";

import type { ComponentProps } from "react";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import { usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import { InkPanel } from "@/registry/ballpoint/lib/ink-panel";
import { Button } from "@/registry/ballpoint/ui/button";

function Dialog({ ...props }: DialogPrimitive.Root.Props) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}

function DialogTrigger({ ...props }: DialogPrimitive.Trigger.Props) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}

function DialogPortal({ ...props }: DialogPrimitive.Portal.Props) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}

function DialogClose({ ...props }: DialogPrimitive.Close.Props) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}

/** Tracing paper over the page: it dims and softens what's underneath. */
function DialogOverlay({ className, ...props }: DialogPrimitive.Backdrop.Props) {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-paper/65 backdrop-blur-[1.5px] transition-opacity duration-(--dur-state) ease-out",
        "data-ending-style:opacity-0 data-ending-style:ease-in data-starting-style:opacity-0",
        // iOS: cover the whole visible viewport.
        "supports-[-webkit-touch-callout:none]:absolute",
        className,
      )}
      {...props}
    />
  );
}

type DialogPen = Omit<Pen, "fill"> & { seed?: string | number };

/**
 * A sheet of paper laid over the page: pencilled round, lifted off its
 * hatched shadow, and drawn in as it lands.
 */
function DialogContent({
  className,
  children,
  showCloseButton = true,
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
}: DialogPrimitive.Popup.Props & DialogPen & { showCloseButton?: boolean }) {
  const pen = usePen({ roughness, passes, radius, corners, shadow, draw, weight, speed });
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Viewport data-slot="dialog-viewport" className="fixed inset-0 z-50 flex items-center justify-center p-5">
        <DialogPrimitive.Popup
          data-slot="dialog-content"
          className={cn(
            "ink-paper relative isolate grid w-full max-w-md gap-5 p-6 text-base text-popover-foreground outline-none",
            // It lands: a little low and askew, then settles flat.
            "transition-[opacity,translate,rotate] duration-(--dur-enter) ease-out-expo data-starting-style:opacity-0 data-ending-style:opacity-0",
            "motion-safe:data-starting-style:translate-y-3 motion-safe:data-starting-style:-rotate-1",
            "data-ending-style:duration-(--dur-state) data-ending-style:ease-in motion-safe:data-ending-style:translate-y-1.5",
            className,
          )}
          {...props}
        >
          <InkPanel pen={pen} seed={seed} estimate={[448, 240]} offset={7} className="text-ink-line" />
          {children}
          {showCloseButton && (
            <DialogPrimitive.Close data-slot="dialog-close" render={<Button variant="ghost" size="icon-sm" className="absolute top-3 right-3" />}>
              <InkGlyph name="close" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          )}
        </DialogPrimitive.Popup>
      </DialogPrimitive.Viewport>
    </DialogPortal>
  );
}

function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-1.5 pr-8", className)} {...props} />;
}

function DialogFooter({ className, showCloseButton = false, children, ...props }: ComponentProps<"div"> & { showCloseButton?: boolean }) {
  return (
    <div data-slot="dialog-footer" className={cn("flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end", className)} {...props}>
      {children}
      {showCloseButton && <DialogPrimitive.Close render={<Button variant="outline" />}>Close</DialogPrimitive.Close>}
    </div>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.Title.Props) {
  return <DialogPrimitive.Title data-slot="dialog-title" className={cn("text-xl leading-snug font-bold", className)} {...props} />;
}

function DialogDescription({ className, ...props }: DialogPrimitive.Description.Props) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn("text-base text-ink-3 *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-ink", className)}
      {...props}
    />
  );
}

export { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger };
