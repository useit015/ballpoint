import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { slipProps } from "@/lib/slip";

/**
 * Code on the cream slip laid on the page (.slip): its own texture and a
 * soft shadow, no drawn border. `header` sits above the code (a file name,
 * tabs, a copy button).
 */
export function CodeFrame({ header, children, className, seed }: { header?: ReactNode; children: ReactNode; className?: string; seed?: string }) {
  return (
    <figure className={cn("code-block slip relative isolate min-w-0", className)} {...slipProps(seed ?? "code")}>
      {header && <figcaption className="flex min-h-11 items-center justify-between gap-4 pr-2 pl-5">{header}</figcaption>}
      <div className={cn("code", !header && "pt-4")}>{children}</div>
    </figure>
  );
}
