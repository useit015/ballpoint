"use client";

import { useMemo } from "react";
import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion";
import { cn } from "@/lib/utils";
import { useInkSeed } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke, inkRules } from "@/registry/ballpoint/lib/ink";
import { chevronStroke } from "@/registry/ballpoint/lib/ink-sketch";

function Accordion({ className, style, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      style={typeof style === "function" ? (state) => ({ ...inkRules, ...style(state) }) : { ...inkRules, ...style }}
      {...props}
    />
  );
}

/** Items are ruled off from each other by hand (see inkRules). */
function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(
        "relative not-last:after:pointer-events-none not-last:after:absolute not-last:after:inset-x-0 not-last:after:-bottom-[2.5px] not-last:after:h-[5px] not-last:after:bg-ink-4 not-last:after:[mask-image:var(--ink-rule-1)] not-last:after:[mask-size:100%_100%] nth-[3n+2]:after:[mask-image:var(--ink-rule-2)] nth-[3n]:after:[mask-image:var(--ink-rule-3)]",
        className,
      )}
      {...props}
    />
  );
}

/** The heading row; its drawn chevron turns over when the item opens. */
function AccordionTrigger({ className, children, seed, ...props }: AccordionPrimitive.Trigger.Props & { seed?: string | number }) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 cursor-pointer items-center justify-between gap-4 py-3.5 text-left text-base font-bold transition-colors outline-none",
          "hover:text-ink-2 focus-visible:outline-solid focus-visible:outline-[1.5px] focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:[border-radius:var(--hand-radius)]",
          "aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className,
        )}
        {...props}
      >
        {children}
        <Chevron seed={seed} />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}

function Chevron({ seed }: { seed?: string | number }) {
  const s = useInkSeed(seed);
  const d = useMemo(() => chevronStroke(s, 12, 7), [s]);
  return (
    <span
      data-slot="accordion-trigger-icon"
      aria-hidden="true"
      className="relative size-4 shrink-0 text-ink-3 transition-transform duration-(--dur-state) ease-out group-data-panel-open/accordion-trigger:rotate-180 motion-reduce:transition-none"
    >
      <InkSvg box={[-2, -4.5, 16, 16]} className="inset-0 size-full">
        <Stroke d={d} width={1.6} />
      </InkSvg>
    </span>
  );
}

function AccordionContent({ className, children, ...props }: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="h-(--accordion-panel-height) overflow-hidden text-base text-ink-2 transition-[height] duration-(--dur-state) ease-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none"
      {...props}
    >
      <div className={cn("pb-4 [&_a]:underline [&_a]:underline-offset-3 [&_p:not(:last-child)]:mb-4", className)}>{children}</div>
    </AccordionPrimitive.Panel>
  );
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
