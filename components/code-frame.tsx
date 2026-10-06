"use client";

import type { ReactNode } from "react";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";
import { cn } from "@/lib/utils";

/**
 * A slip of lighter paper for code, pencilled round like an index card.
 * `header` sits on the slip above the code (a file name, tabs, a copy button).
 */
export function CodeFrame({ header, children, className, seed }: { header?: ReactNode; children: ReactNode; className?: string; seed?: string }) {
  return (
    <figure className={cn("code-block relative isolate min-w-0", className)}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 [border-radius:var(--hand-radius)] bg-(--code-slip)" />
      <InkOutline pen={{ draw: "none", passes: 2, roughness: 0.8 }} seed={seed} estimate={[640, 140]} className="-z-10 text-ink-4" />
      {header && <figcaption className="flex min-h-11 items-center justify-between gap-4 pr-2 pl-5">{header}</figcaption>}
      <div className={cn("code", !header && "pt-4")}>{children}</div>
    </figure>
  );
}
