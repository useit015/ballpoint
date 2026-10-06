"use client";

import { useMemo, type ComponentProps } from "react";
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar";
import { cn } from "@/lib/utils";
import { penStyle, useInkSeed, usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";
import { dotStroke, ringStroke } from "@/registry/ballpoint/lib/ink-sketch";

const sizes = { sm: 24, default: 32, lg: 40 } as const;

/** A portrait circled with the pen, the way you'd ring a face in a photo. */
function Avatar({
  className,
  size = "default",
  children,
  seed,
  passes,
  draw,
  weight,
  speed,
  ...props
}: AvatarPrimitive.Root.Props & Pick<Pen, "passes" | "draw" | "weight" | "speed"> & { size?: keyof typeof sizes; seed?: string | number }) {
  const pen = usePen({ passes, draw, weight, speed });
  const d = sizes[size];
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-8 shrink-0 rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6",
        className,
      )}
      {...props}
    >
      {children}
      <AvatarRing seed={seed} size={d} pen={pen} />
    </AvatarPrimitive.Root>
  );
}

function AvatarRing({ seed, size, pen }: { seed?: string | number; size: number; pen: Pen }) {
  const s = useInkSeed(seed);
  const passes = pen.passes ?? 1;
  const rings = useMemo(() => Array.from({ length: passes }, (_, i) => ringStroke(s + i, size + 4, { turns: 1.05 + i * 0.06 })), [s, size, passes]);
  const draw = pen.draw === "none" ? "none" : "mount";
  return (
    <InkSvg box={[-2, -2, size + 8, size + 8]} className="-inset-1 text-ink" style={{ width: size + 8, height: size + 8, ...penStyle(pen) }}>
      {rings.map((r, i) => (
        <Stroke key={i} d={r} draw={draw} delay={i * 240} duration={420} width={[1.4, 1][i] ?? 0.9} opacity={[1, 0.6, 0.45][i]} />
      ))}
    </InkSvg>
  );
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return <AvatarPrimitive.Image data-slot="avatar-image" className={cn("aspect-square size-full rounded-full object-cover", className)} {...props} />;
}

/** Initials, written in the hand on a light wash of ink. */
function AvatarFallback({ className, ...props }: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-ink-5 text-sm text-ink group-data-[size=lg]/avatar:text-base group-data-[size=sm]/avatar:text-xs",
        className,
      )}
      {...props}
    />
  );
}

/** A dot inked onto the ring. */
function AvatarBadge({ className, seed, ...props }: ComponentProps<"span"> & { seed?: string | number }) {
  const s = useInkSeed(seed);
  const dot = useMemo(() => dotStroke(s, 2.6), [s]);
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex size-2.5 items-center justify-center rounded-full bg-background text-ink select-none group-data-[size=lg]/avatar:size-3 group-data-[size=sm]/avatar:size-2",
        className,
      )}
      {...props}
    >
      <InkSvg box={[-4, -4, 8, 8]} className="inset-0 size-full">
        <Stroke d={dot} width={2} />
      </InkSvg>
    </span>
  );
}

function AvatarGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      // Overlapping like coins on the page: each one's paper rim hides the
      // ring of the one before it, so the drawn rings never cross.
      className={cn("group/avatar-group flex -space-x-1 *:data-[slot=avatar]:bg-background *:data-[slot=avatar]:ring-[3px] *:data-[slot=avatar]:ring-background", className)}
      {...props}
    />
  );
}

/** How many more, ringed like the rest but lighter. */
function AvatarGroupCount({ className, children, seed, ...props }: ComponentProps<"div"> & { seed?: string | number }) {
  const pen = usePen({});
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-background text-sm text-ink-2 ring-[3px] ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=sm]/avatar-group:text-xs",
        className,
      )}
      {...props}
    >
      <InkOutline pen={pen} seed={seed} shape="ring" estimate={[32, 32]} pad={4} className="text-ink-line" />
      {children}
    </div>
  );
}

export { Avatar, AvatarImage, AvatarFallback, AvatarBadge, AvatarGroup, AvatarGroupCount };
