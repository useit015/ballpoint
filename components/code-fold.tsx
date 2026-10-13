"use client";

import { useId, useState, type ReactNode } from "react";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";

/** A long listing shows its first lines; the rest opens on request (and is all there for copying either way). */
export function CodeFold({ lines, children }: { lines: number; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="code-fold" data-folded={open ? undefined : ""}>
      <div id={id} className="code-fold-body">
        {children}
      </div>
      <button type="button" className="code-fold-toggle" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        {open ? "Fold it up" : `Show all ${lines} lines`}
        <InkIcon name="chevron-down" className="size-4" />
      </button>
    </div>
  );
}
