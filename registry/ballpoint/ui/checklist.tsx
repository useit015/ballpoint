"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { CheckboxGroup } from "@base-ui/react/checkbox-group";
import { cn } from "@/lib/utils";
import { useInkBox, useInkSeed } from "@/registry/ballpoint/hooks/use-ink-box";
import { inkClassName, InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { lineStroke } from "@/registry/ballpoint/lib/ink-sketch";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";

const DoneContext = createContext<readonly string[]>([]);

/**
 * A to-do list: tick an item and it's struck through with the pen, and
 * pales; untick it and the line pulls back out. Controlled with `value`, or
 * uncontrolled with `defaultValue`; either is the list of done items.
 */
function Checklist({
  value,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: Omit<CheckboxGroup.Props, "value" | "defaultValue"> & { value?: string[]; defaultValue?: string[]; children: ReactNode }) {
  const [own, setOwn] = useState(defaultValue ?? []);
  const done = value ?? own;
  return (
    <CheckboxGroup
      data-slot="checklist"
      value={done}
      onValueChange={(next, details) => {
        onValueChange?.(next, details);
        if (value === undefined && !details.isCanceled) setOwn(next);
      }}
      className={inkClassName("flex flex-col gap-3", className)}
      {...props}
    >
      <DoneContext value={done}>{children}</DoneContext>
    </CheckboxGroup>
  );
}

/** One thing to do. `value` is what the list reports when it's done. */
function ChecklistItem({ value, disabled, seed, className, children }: { value: string; disabled?: boolean; seed?: string | number; className?: string; children: ReactNode }) {
  const done = useContext(DoneContext).includes(value);
  return (
    <label
      data-slot="checklist-item"
      data-done={done ? "" : undefined}
      className={cn("flex w-fit cursor-pointer items-start gap-3 text-base has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50", className)}
    >
      <Checkbox value={value} disabled={disabled} seed={seed} className="mt-1" />
      <Struck done={done} seed={seed}>
        {children}
      </Struck>
    </label>
  );
}

/** The words, and the line drawn through them while the item's done. */
function Struck({ done, seed, children }: { done: boolean; seed?: string | number; children: ReactNode }) {
  const s = useInkSeed(seed === undefined ? undefined : `${seed}-strike`);
  const [ref, [w, h]] = useInkBox([140, 29]);
  const strike = useMemo(() => lineStroke(s, [-3, h * 0.6], [w + 4, h * 0.5], { bow: 0.8, jitter: 0.5, overshoot: 2 }), [s, w, h]);
  return (
    <span data-checked={done ? "" : undefined} className="relative transition-colors duration-(--dur-state) data-checked:text-ink-3">
      <InkSvg ref={ref} box={[-6, 0, w + 12, h]} stretch className="inset-y-0 -left-1.5 h-full w-[calc(100%+12px)] text-ink">
        <Stroke d={strike} draw="checked" duration={Math.min(520, 200 + w * 1.4)} width={1.6} />
      </InkSvg>
      {children}
    </span>
  );
}

export { Checklist, ChecklistItem };
