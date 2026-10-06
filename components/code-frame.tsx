"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Code on a lighter patch of the page: no border, just the paper lifted a
 * little. `header` sits above the code (a file name, tabs, a copy button).
 */
export function CodeFrame({ header, children, className }: { header?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <figure className={cn("code-block relative isolate min-w-0", className)}>
      <div aria-hidden="true" className="absolute inset-0 -z-10 [border-radius:var(--hand-radius)] bg-(--code-slip)" />
      {header && <figcaption className="flex min-h-11 items-center justify-between gap-4 pr-2 pl-5">{header}</figcaption>}
      <div className={cn("code", !header && "pt-4")}>{children}</div>
    </figure>
  );
}
