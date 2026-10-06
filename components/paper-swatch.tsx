import type { CSSProperties, ReactNode } from "react";
import { paperTile } from "@/lib/paper";
import { cn } from "@/lib/utils";
import { papers, type PaperName } from "@/registry/themes";

/** A small cut sheet of one of the papers, in a given light. */
export function PaperSwatch({
  paper,
  mode,
  className,
  children,
}: {
  paper: PaperName;
  mode: "light" | "dark";
  className?: string;
  children?: ReactNode;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("paper-sheet sheet relative inline-flex items-center justify-center", className)}
      style={{ "--paper": papers[paper].paper[mode], "--paper-tile": paperTile(paper, mode) } as CSSProperties}
    >
      {children}
    </span>
  );
}
