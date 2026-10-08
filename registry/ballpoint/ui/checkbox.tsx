"use client";

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { inkClassName, Stroke } from "@/registry/ballpoint/lib/ink";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";
import { dashStroke, tickStroke } from "@/registry/ballpoint/lib/ink-sketch";

/**
 * A drawn box. Checking it ticks it, the pen running up and out past the
 * corner; unchecking pulls the tick back out. Indeterminate is a dash.
 */
function Checkbox({
  className,
  seed,
  roughness,
  passes,
  radius,
  corners,
  draw,
  weight,
  speed,
  ...props
}: CheckboxPrimitive.Root.Props & Omit<Pen, "fill" | "shadow"> & { seed?: string | number }) {
  const pen = usePen({ roughness, passes, radius, corners, draw, weight, speed });
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={inkClassName(
        "peer group/checkbox relative inline-flex size-5 shrink-0 cursor-pointer items-center justify-center outline-none",
        // A finger-sized hit area around the small box.
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "text-ink-3 transition-colors duration-(--dur-hover) not-data-checked:not-data-indeterminate:hover:text-ink data-checked:text-ink data-indeterminate:text-ink",
        "aria-invalid:text-destructive data-invalid:text-destructive",
        "focus-visible:outline-solid focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-ring focus-visible:[border-radius:var(--hand-radius)]",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <InkOutline pen={pen} seed={seed} estimate={[20, 20]} pad={6} maxRadius={6}>
        {({ w, h, s }) => (
          <>
            <Stroke d={tickStroke(s + 40, w)} draw="checked" duration={280} width={1.9} />
            <Stroke d={dashStroke(s + 41, w, h / 2)} draw="indeterminate" duration={200} width={1.9} />
          </>
        )}
      </InkOutline>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
