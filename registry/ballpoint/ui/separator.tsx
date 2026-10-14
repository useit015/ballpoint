"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { Separator as SeparatorPrimitive } from "@base-ui/react/separator";
import { penStyle, useInkBox, useInkSeed, usePen, type Pen } from "@/registry/ballpoint/hooks/use-ink-box";
import { inkClassName, InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { ruleStroke, verticalStroke } from "@/registry/ballpoint/lib/ink-sketch";

// Drawn long and stretched along its length only, so the line keeps its
// weight at any size and never needs redrawing as it resizes.
const LENGTH = 700;

/**
 * A wandering pen rule. Give it children and they are written in the middle
 * of a rule that runs both sides: the "or" between two ways to sign in.
 */
function Separator({ children, ...props }: SeparatorProps) {
  if (!children) return <Rule {...props} />;
  const { className, ...rule } = props;
  return (
    <div role="separator" aria-orientation="horizontal" className={cn("flex w-full items-center gap-3 text-sm text-ink-3", className)}>
      <Rule {...rule} aria-hidden="true" role="presentation" className="flex-1" />
      <span>{children}</span>
      <Rule {...rule} aria-hidden="true" role="presentation" className="flex-1" delay={(rule.delay ?? 0) + 200} />
    </div>
  );
}

type SeparatorProps = SeparatorPrimitive.Props & Pick<Pen, "draw" | "weight" | "speed"> & { seed?: string | number; delay?: number };

function Rule({
  className,
  orientation = "horizontal",
  seed,
  delay = 0,
  draw,
  weight,
  speed,
  ...props
}: SeparatorProps) {
  const pen = usePen({ draw, weight, speed });
  const s = useInkSeed(seed);
  const [ref] = useInkBox([LENGTH, 4]);
  const horizontal = orientation === "horizontal";
  const d = useMemo(() => (horizontal ? ruleStroke(s, LENGTH) : verticalStroke(s, LENGTH)), [horizontal, s]);
  const mode = pen.draw ?? "auto";
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={inkClassName(
        "relative shrink-0 text-ink-4 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        className,
      )}
      {...props}
    >
      <InkSvg
        ref={ref}
        pending={mode === "auto"}
        box={horizontal ? [0, -1, LENGTH, 5] : [0, -1, 3, LENGTH + 2]}
        stretch
        className={horizontal ? "inset-x-0 -top-0.5 h-[5px] w-full" : "-left-[1px] inset-y-0 h-full w-[3px]"}
        style={penStyle(pen)}
      >
        <Stroke d={d} draw={mode} delay={delay} duration={700} width={1.1} />
      </InkSvg>
    </SeparatorPrimitive>
  );
}

export { Separator };
