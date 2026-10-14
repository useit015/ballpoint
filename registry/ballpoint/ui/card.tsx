"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { useId, useMemo, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { Stroke } from "@/registry/ballpoint/lib/ink";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";
import { hatchStrokes, roundedRectPath } from "@/registry/ballpoint/lib/ink-sketch";
import { Separator } from "@/registry/ballpoint/ui/separator";

type Variant = "outline" | "lifted" | "wash";

/**
 * A box pencilled around a block of content. The outline is decoration, so
 * it's drawn at a lighter pressure than a control's.
 *
 * - `outline`: just the pencilled box.
 * - `lifted`: the box stands off a hatched shadow, the way a button does
 *   (`shadow="solid"` blacks it in; `interactive` cards lift further on hover).
 * - `wash`: the box is lightly hatched across, like a note.
 *
 * `interactive` makes the whole card something to press: it rises on hover
 * and takes a focus ring. Give it `render={<a href="…" />}` to make it a link.
 * `selected` goes over the outline in full ink, for cards that are picked.
 */
function Card({
  className,
  size = "default",
  variant = "outline",
  interactive = false,
  selected = false,
  render,
  children,
  seed,
  roughness,
  passes,
  radius,
  corners,
  fill,
  shadow,
  draw,
  weight,
  speed,
  ...props
}: useRender.ComponentProps<"div"> & Pen & { size?: "default" | "sm"; variant?: Variant; interactive?: boolean; selected?: boolean; seed?: string | number }) {
  const pen = usePen({ roughness, passes, radius, corners, fill, shadow, draw, weight, speed });
  // Only a lifted card has a shadow, and only a wash a fill, unless asked: a
  // provider's shadow or fill is for controls, not every card on the page.
  const lift = shadow ?? (variant === "lifted" ? "hatch" : "none");
  const wash = fill ?? (variant === "wash" ? "hatch" : undefined);
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        "data-slot": "card",
        "data-size": size,
        "data-variant": variant,
        "data-selected": selected ? "" : undefined,
        className: cn(
          "group/card relative flex flex-col gap-(--card-spacing) py-(--card-spacing) text-base text-card-foreground [--card-spacing:--spacing(6)] has-data-[slot=card-footer]:pb-0 data-[size=sm]:[--card-spacing:--spacing(4)]",
          interactive && "ink-within cursor-pointer outline-none transition-transform duration-(--dur-hover) ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5 active:translate-y-0 motion-reduce:transition-none",
          className,
        ),
        children: (
          <>
            <InkOutline pen={pen} seed={seed} estimate={[360, 220]} maxRadius={18} focusPass={interactive} className={cn("text-ink-line", selected && "text-ink")}>
              {({ w, h, r, s }) => <CardInk w={w} h={h} r={r} s={s} lift={lift} wash={wash} interactive={interactive} draw={pen.draw} />}
            </InkOutline>
            {children}
          </>
        ),
      } as ComponentProps<"div">,
      props,
    ),
    render,
    state: { slot: "card", variant },
  });
}

/** What a card has besides its outline: a hatched shadow under it, a hatched wash over it. */
function CardInk({ w, h, r, s, lift, wash, interactive, draw }: { w: number; h: number; r: number; s: number; lift: NonNullable<Pen["shadow"]>; wash: Pen["fill"]; interactive: boolean; draw: Pen["draw"] }) {
  const id = useId().replace(/[^\w-]/g, "");
  const body = useMemo(() => roundedRectPath(w, h, r), [w, h, r]);
  const hatch = useMemo(() => (wash && wash !== "flat" ? hatchStrokes(s + 30, w, h, { gap: 6.5, angle: -50, jitter: 0.5, inset: 1.5 }).join("") : ""), [wash, s, w, h]);
  return (
    <>
      <defs>
        {lift === "hatch" && (
          <pattern id={`${id}-hatch`} patternUnits="userSpaceOnUse" width={3.2} height={3.2} patternTransform="rotate(-45)">
            <path d="M0 -1V4.2" style={{ strokeWidth: 1.05 }} />
          </pattern>
        )}
        {/* The shadow is masked out from under the card, so the card stays the paper itself. */}
        {lift !== "none" && (
          <mask id={`${id}-under`} maskUnits="userSpaceOnUse" x={-30} y={-30} width={w + 60} height={h + 60}>
            <rect x={-30} y={-30} width={w + 60} height={h + 60} fill="#fff" />
            <path d={body} style={{ fill: "#000", stroke: "#000", strokeWidth: 1.5 }} />
          </mask>
        )}
        {hatch && (
          <clipPath id={`${id}-clip`}>
            <path d={body} />
          </clipPath>
        )}
      </defs>
      {lift !== "none" && (
        <g mask={`url(#${id}-under)`}>
          <g className={cn("transition-[translate] duration-(--dur-hover) ease-out motion-reduce:transition-none", interactive ? "translate-[6px] group-hover/card:translate-[9px] group-focus-visible/card:translate-[9px] group-active/card:translate-[4px]" : "translate-[7px]")}>
            <path d={body} style={lift === "hatch" ? { fill: `url(#${id}-hatch)`, stroke: "none" } : { fill: "currentColor", stroke: "none", opacity: 0.8 }} />
            <path d={body} style={{ fill: "none", strokeWidth: 1 }} />
          </g>
        </g>
      )}
      {hatch && (
        <g clipPath={`url(#${id}-clip)`}>
          <Stroke d={hatch} draw={draw ?? "auto"} delay={250} duration={620} width={0.9} opacity={0.3} />
        </g>
      )}
    </>
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

/**
 * A picture, or any drawing, across the top of the card: it runs edge to edge
 * inside the pencilled box and is ruled off from what is under it.
 */
function CardMedia({ className, children, ...props }: ComponentProps<"div">) {
  return (
    <div data-slot="card-media" className={cn("relative mx-[3px] -mt-[calc(var(--card-spacing)-3px)] flex flex-col overflow-hidden [&>img]:w-full [&>img]:object-cover", className)} {...props}>
      {children}
      <Separator className="absolute inset-x-0 bottom-0" />
    </div>
  );
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

export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent, CardMedia };
