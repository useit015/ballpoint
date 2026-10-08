"use client";

import type { ReactNode } from "react";
import { Toast as ToastPrimitive, type ToastManagerAddOptions, type ToastManagerPromiseOptions } from "@base-ui/react/toast";
import { cn } from "@/lib/utils";
import { usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { inkClassName } from "@/registry/ballpoint/lib/ink";
import { InkGlyph, type GlyphName } from "@/registry/ballpoint/lib/ink-glyphs";
import { InkPanel } from "@/registry/ballpoint/lib/ink-panel";
import { Button } from "@/registry/ballpoint/ui/button";

// One manager for the whole app, so toast() works from anywhere: event
// handlers, server-action callbacks, plain functions. Render <Toaster />
// once, near the root.
const manager = ToastPrimitive.createToastManager();

type ToastType = "success" | "error" | "warning" | "info" | "loading";

type ToastOptions = Omit<ToastManagerAddOptions<object>, "title" | "type" | "actionProps"> & {
  /** A button on the note, e.g. `{ label: "Undo", onClick }`. */
  action?: { label: ReactNode; onClick: () => void };
};

function add(type: ToastType | undefined, title: ReactNode, { action, ...options }: ToastOptions = {}) {
  return manager.add({
    ...options,
    title,
    type,
    actionProps: action && { children: action.label, onClick: action.onClick },
  });
}

/**
 * Pin a note to the corner of the page. Returns its id.
 *   toast("Saved")
 *   toast.success("Sent", { description: "We'll write back soon." })
 *   toast.promise(save(), { loading: "Saving…", success: "Saved", error: "Couldn't save" })
 */
const toast = Object.assign((title: ReactNode, options?: ToastOptions) => add(undefined, title, options), {
  success: (title: ReactNode, options?: ToastOptions) => add("success", title, options),
  error: (title: ReactNode, options?: ToastOptions) => add("error", title, options),
  warning: (title: ReactNode, options?: ToastOptions) => add("warning", title, options),
  info: (title: ReactNode, options?: ToastOptions) => add("info", title, options),
  loading: (title: ReactNode, options?: ToastOptions) => add("loading", title, { timeout: 0, ...options }),
  promise: <Value,>(promise: Promise<Value>, options: ToastManagerPromiseOptions<Value, object>) => manager.promise(promise, options),
  update: manager.update,
  /** Takes the note down; with no id, every note. */
  dismiss: (id?: string) => manager.close(id),
});

const glyphFor: Record<ToastType, GlyphName> = { success: "check", error: "close", warning: "alert", info: "info", loading: "loading" };

/**
 * Where the notes land: the bottom-right corner (bottom of the screen on
 * phones). They stack, a little smaller behind each other, and fan out
 * while hovered or focused. Swipe one away, or press F6 to reach them.
 */
function Toaster({
  limit = 3,
  timeout = 5000,
  className,
  seed,
  roughness,
  passes,
  radius,
  corners,
  shadow,
  draw,
  weight,
  speed,
}: { limit?: number; timeout?: number; className?: string; seed?: string | number } & Omit<Pen, "fill">) {
  const pen = usePen({ roughness, passes, radius, corners, shadow, draw, weight, speed });
  return (
    <ToastPrimitive.Provider toastManager={manager} limit={limit} timeout={timeout}>
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport
          data-slot="toaster"
          className={inkClassName("fixed right-4 bottom-4 z-60 mx-auto w-[calc(100vw-2rem)] sm:right-8 sm:bottom-8 sm:w-90", className)}
        >
          <Toasts pen={pen} seed={seed} />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}

function Toasts({ pen, seed }: { pen: Pen; seed?: string | number }) {
  const { toasts } = ToastPrimitive.useToastManager();
  return toasts.map((t) => {
    const glyph = glyphFor[t.type as ToastType];
    return (
      <ToastPrimitive.Root
        key={t.id}
        toast={t}
        data-slot="toast"
        className={cn(
          "group/toast ink-paper absolute right-0 bottom-0 isolate w-full origin-bottom text-popover-foreground select-none",
          // Stacked: each note behind the first peeks out above it, a little smaller.
          "[--gap:0.875rem] [--peek:0.625rem] [--scale:calc(max(0,1-(var(--toast-index)*0.06)))] [--shrink:calc(1-var(--scale))] [--height:var(--toast-frontmost-height,var(--toast-height))]",
          "[--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))]",
          "z-[calc(1000-var(--toast-index))] h-(--height) [transform:translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))]",
          // Fanned out while the corner is hovered or focused.
          "data-expanded:h-(--toast-height) data-expanded:[transform:translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
          // A bridge across the gap, so moving between notes keeps them fanned out.
          "after:absolute after:top-full after:left-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
          "[transition:transform_var(--dur-enter)_var(--ease-out-expo),opacity_var(--dur-enter),height_var(--dur-hover)] motion-reduce:[transition:opacity_var(--dur-hover)]",
          "data-limited:opacity-0 data-starting-style:[transform:translateY(150%)] motion-reduce:data-starting-style:opacity-0",
          "data-ending-style:opacity-0 [&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:[transform:translateY(150%)]",
          "data-ending-style:data-[swipe-direction=down]:[transform:translateY(calc(var(--toast-swipe-movement-y)+150%))]",
          "data-ending-style:data-[swipe-direction=up]:[transform:translateY(calc(var(--toast-swipe-movement-y)-150%))]",
          "data-ending-style:data-[swipe-direction=left]:[transform:translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
          "data-ending-style:data-[swipe-direction=right]:[transform:translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        )}
      >
        <InkPanel
          pen={pen}
          seed={seed}
          estimate={[360, 72]}
          offset={5}
          className="text-ink-3 group-data-[type=error]/toast:text-destructive"
        />
        <ToastPrimitive.Content className="flex h-full items-start gap-3 overflow-hidden py-3.5 pr-11 pl-4 transition-opacity duration-(--dur-hover) data-behind:opacity-0 data-expanded:opacity-100">
          {glyph && (
            <span
              data-slot="toast-icon"
              className={cn(
                "mt-1 flex shrink-0 text-ink group-data-[type=error]/toast:text-destructive",
                t.type === "loading" && "motion-safe:animate-spin motion-safe:[animation-duration:1.4s]",
              )}
            >
              <InkGlyph name={glyph} draw={t.type === "loading" ? "none" : "mount"} duration={320} />
            </span>
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-0.5">
            <ToastPrimitive.Title data-slot="toast-title" className="text-base leading-snug font-bold group-data-[type=error]/toast:text-destructive" />
            <ToastPrimitive.Description data-slot="toast-description" className="text-sm text-ink-2" />
            {t.actionProps && (
              <ToastPrimitive.Action data-slot="toast-action" render={<Button variant="outline" size="xs" className="mt-2 self-start" />} />
            )}
          </div>
          <ToastPrimitive.Close data-slot="toast-close" aria-label="Dismiss" render={<Button variant="ghost" size="icon-xs" className="absolute top-2.5 right-2.5" />}>
            <InkGlyph name="close" className="size-3.5" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Content>
      </ToastPrimitive.Root>
    );
  });
}

export { Toaster, toast };
