"use client";

import type { CSSProperties } from "react";
import { useInkStage } from "@/registry/ballpoint/hooks/use-ink-box";
import { SectionHeading } from "@/registry/ballpoint/ui/section-heading";
import { Separator } from "@/registry/ballpoint/ui/separator";

/** Drawings in view together and one below the fold, for the drawing-order tests. */
export function InkOrder() {
  const list = useInkStage();
  return (
    <>
      <SectionHeading>First</SectionHeading>
      <ul data-testid="list" {...list}>
        {["One", "Two", "Three"].map((word, i) => (
          <li key={word} className="ink-land" style={{ "--ink-dd": `${i * 80}ms` } as CSSProperties}>
            {word}
          </li>
        ))}
      </ul>
      <SectionHeading>Second</SectionHeading>
      <Separator />
      <div className="h-[150vh]" />
      <SectionHeading>Below</SectionHeading>
    </>
  );
}
