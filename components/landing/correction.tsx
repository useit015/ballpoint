"use client";

import { useMemo, type CSSProperties } from "react";
import { useInkBox, useInkSeed } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { handCurve } from "@/registry/ballpoint/lib/ink-sketch";

/**
 * The shadcn install line, typed, with the one change Ballpoint makes
 * written in by hand: a proofreader's caret under the gap and the insertion
 * above it, in red. Marked up the first time it scrolls into view.
 */
export function Correction({ seed = "correction" }: { seed?: string }) {
  const s = useInkSeed(seed);
  const [ref] = useInkBox([40, 30]);
  const caret = useMemo(() => handCurve(s, [[3, 27], [12, 14], [20, 2], [28, 15], [37, 28]], { jitter: 0.9 }), [s]);

  return (
    <figure className="correction relative w-fit max-w-full pt-[1.25em] font-mono leading-none [font-variation-settings:'MONO'_1,'CASL'_0]">
      <figcaption className="sr-only">The install, corrected: npx shadcn add @ballpoint/button</figcaption>
      <p aria-hidden="true" className="whitespace-nowrap text-[var(--code-plain)]">
        <span className="text-ink-4">$ </span>npx shadcn add{" "}
        <span className="relative inline-block w-0">
          <InkSvg ref={ref} pending box={[0, 0, 40, 30]} className="text-pen-red" style={{ left: "-0.5em", top: "0.34em", width: "0.72em", height: "0.54em" }}>
            <Stroke d={caret} draw="auto" duration={260} width={3.2} />
          </InkSvg>
          <span
            className="ink-write absolute bottom-[1.05em] left-0 -translate-x-[58%] -rotate-[5deg] font-sans text-[1.18em] font-bold whitespace-nowrap text-pen-red [font-variation-settings:normal]"
            style={{ "--ink-d": "760ms", "--ink-dd": "280ms" } as CSSProperties}
          >
            @ballpoint/
          </span>
        </span>
        button
      </p>
    </figure>
  );
}
