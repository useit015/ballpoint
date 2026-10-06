"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";
import { cn } from "@/lib/utils";
import { usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { Stroke } from "@/registry/ballpoint/lib/ink";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";
import { dotStroke } from "@/registry/ballpoint/lib/ink-sketch";

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return <RadioGroupPrimitive data-slot="radio-group" className={cn("grid w-full gap-3", className)} {...props} />;
}

/** A drawn ring; choosing it inks a dot in the middle with a tight spiral. */
function RadioGroupItem({
  className,
  seed,
  passes,
  draw,
  weight,
  speed,
  ...props
}: RadioPrimitive.Root.Props & Pick<Pen, "passes" | "draw" | "weight" | "speed"> & { seed?: string | number }) {
  const pen = usePen({ passes, draw, weight, speed });
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "peer group/radio relative inline-flex size-5 shrink-0 cursor-pointer items-center justify-center rounded-full outline-none",
        "after:absolute after:-inset-x-3 after:-inset-y-2",
        "text-ink-line transition-colors duration-(--dur-hover) not-data-checked:hover:text-ink-3 data-checked:text-ink",
        "aria-invalid:text-destructive data-invalid:text-destructive",
        "focus-visible:outline-solid focus-visible:outline-[1.5px] focus-visible:outline-offset-4 focus-visible:outline-ring",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <InkOutline pen={pen} seed={seed} estimate={[20, 20]} shape="ring" pad={6}>
        {({ w, h, s }) => (
          <g transform={`translate(${w / 2} ${h / 2})`}>
            <Stroke d={dotStroke(s + 40, w * 0.22)} draw="checked" duration={260} width={w * 0.17} />
          </g>
        )}
      </InkOutline>
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem };
