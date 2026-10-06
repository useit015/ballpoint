import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Code on a lighter slip of paper laid on the page: its own texture and a
 * soft shadow, no drawn border. `header` sits above the code (a file name,
 * tabs, a copy button).
 */
export function CodeFrame({ header, children, className }: { header?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <figure className={cn("code-block code-slip sheet relative isolate min-w-0", className)}>
      {header && <figcaption className="flex min-h-11 items-center justify-between gap-4 pr-2 pl-5">{header}</figcaption>}
      <div className={cn("code", !header && "pt-4")}>{children}</div>
    </figure>
  );
}
