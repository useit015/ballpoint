"use client";

import type { CSSProperties, ReactNode } from "react";
import { InkOutline } from "@/registry/ballpoint/lib/ink-outline";
import { paperTile } from "@/lib/paper";
import { cn } from "@/lib/utils";
import { papers, type PaperName } from "@/registry/themes";

/** A torn-off scrap of one of the papers, textured like the page and pencilled round. */
export function PaperSwatch({
  paper,
  mode,
  seed,
  className,
  children,
}: {
  paper: PaperName;
  mode: "light" | "dark";
  seed?: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("paper-sheet relative inline-flex items-center justify-center", className)}
      style={{ "--paper": papers[paper].paper[mode], "--paper-tile": paperTile(paper, mode), borderRadius: "var(--hand-radius)" } as CSSProperties}
    >
      <InkOutline pen={{ draw: "none", roughness: 0.8 }} passes={1} pad={6} seed={seed ?? `swatch-${paper}-${mode}`} estimate={[96, 36]} className="text-ink-4" />
      {children}
    </span>
  );
}
