"use client";

import { useMemo, type ComponentProps } from "react";
import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import { cn } from "@/lib/utils";
import { penStyle, useInkFrame, useInkSeed, usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { inkClassName, InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import { hatchStrokes, lineStroke } from "@/registry/ballpoint/lib/ink-sketch";
import { Button } from "@/registry/ballpoint/ui/button";

type Side = "top" | "right" | "bottom" | "left";

function Sheet({ ...props }: SheetPrimitive.Root.Props) {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
}

function SheetTrigger({ ...props }: SheetPrimitive.Trigger.Props) {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
}

function SheetClose({ ...props }: SheetPrimitive.Close.Props) {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
}

function SheetPortal({ ...props }: SheetPrimitive.Portal.Props) {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
}

/** Tracing paper over the page: it dims and softens what's underneath. */
function SheetOverlay({ className, ...props }: SheetPrimitive.Backdrop.Props) {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={inkClassName(
        "fixed inset-0 z-50 bg-paper/65 backdrop-blur-[1.5px] transition-opacity duration-(--dur-state) ease-out",
        "data-ending-style:opacity-0 data-ending-style:ease-in data-starting-style:opacity-0",
        "supports-[-webkit-touch-callout:none]:absolute",
        className,
      )}
      {...props}
    />
  );
}

/**
 * A sheet of paper slid in from an edge of the page. Its inner edge is
 * ruled twice by hand and hatches a shadow onto the page.
 */
function SheetContent({
  className,
  children,
  side = "right",
  showCloseButton = true,
  seed,
  roughness,
  draw,
  weight,
  speed,
  ...props
}: SheetPrimitive.Popup.Props & Pick<Pen, "roughness" | "draw" | "weight" | "speed"> & { side?: Side; showCloseButton?: boolean; seed?: string | number }) {
  const pen = usePen({ roughness, draw, weight, speed });
  return (
    <SheetPortal>
      <SheetOverlay />
      <SheetPrimitive.Popup
        data-slot="sheet-content"
        data-side={side}
        className={inkClassName(
          "ink-paper fixed isolate z-50 flex flex-col gap-5 text-base text-popover-foreground outline-none",
          "transition-[translate,opacity] duration-(--dur-enter) ease-out-expo data-ending-style:duration-(--dur-state) data-ending-style:ease-in",
          "motion-reduce:data-starting-style:opacity-0 motion-reduce:data-ending-style:opacity-0",
          "data-[side=bottom]:inset-x-0 data-[side=bottom]:bottom-0 data-[side=bottom]:max-h-[85dvh] motion-safe:data-[side=bottom]:data-starting-style:translate-y-full motion-safe:data-[side=bottom]:data-ending-style:translate-y-full",
          "data-[side=top]:inset-x-0 data-[side=top]:top-0 data-[side=top]:max-h-[85dvh] motion-safe:data-[side=top]:data-starting-style:-translate-y-full motion-safe:data-[side=top]:data-ending-style:-translate-y-full",
          "data-[side=left]:inset-y-0 data-[side=left]:left-0 data-[side=left]:w-3/4 data-[side=left]:sm:max-w-sm motion-safe:data-[side=left]:data-starting-style:-translate-x-full motion-safe:data-[side=left]:data-ending-style:-translate-x-full",
          "data-[side=right]:inset-y-0 data-[side=right]:right-0 data-[side=right]:w-3/4 data-[side=right]:sm:max-w-sm motion-safe:data-[side=right]:data-starting-style:translate-x-full motion-safe:data-[side=right]:data-ending-style:translate-x-full",
          className,
        )}
        {...props}
      >
        <SheetEdge side={side} pen={pen} seed={seed} />
        {children}
        {showCloseButton && (
          <SheetPrimitive.Close data-slot="sheet-close" render={<Button variant="ghost" size="icon-sm" className="absolute top-4 right-4" />}>
            <InkGlyph name="close" />
            <span className="sr-only">Close</span>
          </SheetPrimitive.Close>
        )}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
}

const SHADOW = 11;

/** The ruled inner edge and the strip of hatching it casts onto the page. */
function SheetEdge({ side, pen, seed }: { side: Side; pen: Pen; seed?: string | number }) {
  const s = useInkSeed(seed);
  const across = side === "left" || side === "right";
  const { ref, w, h, frame } = useInkFrame(across ? [384, 800] : [1200, 320], { pad: SHADOW + 6, step: 4 });
  const q = pen.roughness ?? 1;
  const mode = pen.draw ?? "mount";
  const paths = useMemo(() => {
    const len = across ? h : w;
    // The edge runs along x = 0 (or y = 0) on the side facing the page;
    // the hatching sits just beyond it.
    const at = side === "right" ? 0 : side === "left" ? w : side === "bottom" ? 0 : h;
    const out = side === "right" || side === "bottom" ? -1 : 1;
    const line = (n: number, off: number) =>
      across
        ? lineStroke(s + n, [at + off * out, -4], [at + off * out, len + 4], { bow: 0.8 * q, jitter: 0.6 * q, overshoot: 2 })
        : lineStroke(s + n, [-4, at + off * out], [len + 4, at + off * out], { bow: 0.8 * q, jitter: 0.6 * q, overshoot: 2 });
    const strip = hatchStrokes(s + 5, across ? SHADOW : len, across ? len : SHADOW, { gap: 4.2, angle: -45, jitter: 0.5 * q }).join("");
    const sx = across ? (out < 0 ? at - SHADOW : at) : 0;
    const sy = across ? 0 : out < 0 ? at - SHADOW : at;
    return { edges: [line(0, 0), line(1, 2.4)], strip, shift: `translate(${sx} ${sy})` };
  }, [across, side, s, w, h, q]);
  return (
    <InkSvg ref={ref} {...frame} className="-z-10 text-ink-line" style={{ ...frame.style, ...penStyle(pen) }}>
      <g transform={paths.shift} opacity={0.5}>
        <Stroke d={paths.strip} width={0.8} />
      </g>
      {paths.edges.map((d, i) => (
        <Stroke key={i} d={d} draw={mode} delay={i * 180} duration={520} width={[1.3, 0.9][i]} opacity={[1, 0.6][i]} />
      ))}
    </InkSvg>
  );
}

function SheetHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="sheet-header" className={cn("flex flex-col gap-1.5 px-6 pt-6 pr-14", className)} {...props} />;
}

function SheetFooter({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="sheet-footer" className={cn("mt-auto flex flex-col gap-3 px-6 pt-1 pb-6", className)} {...props} />;
}

function SheetTitle({ className, ...props }: SheetPrimitive.Title.Props) {
  return <SheetPrimitive.Title data-slot="sheet-title" className={inkClassName("text-xl leading-snug font-bold", className)} {...props} />;
}

function SheetDescription({ className, ...props }: SheetPrimitive.Description.Props) {
  return <SheetPrimitive.Description data-slot="sheet-description" className={inkClassName("text-base text-ink-3", className)} {...props} />;
}

export { Sheet, SheetTrigger, SheetClose, SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription };
