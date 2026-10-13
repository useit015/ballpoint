import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TornSheet, type Fastener } from "@/components/torn-sheet";
import { lay } from "@/lib/tilt";

/**
 * Code on a torn slip of ruled notebook paper (TornSheet): its own texture, a
 * ragged edge and a soft shadow. `header` sits above the code (a file name,
 * tabs, a copy button). `numbers` pencils a line number beside each line.
 * `lay` (a key) sets it a little askew, and tapes or clips it, the way that key
 * always does; without one the slip lies square.
 */
export function CodeFrame({ header, children, className, numbers, lay: key, fastener }: { header?: ReactNode; children: ReactNode; className?: string; numbers?: boolean; lay?: string; fastener?: Fastener }) {
  const how = key ? lay(key, fastener) : { tilt: undefined, edge: "a" as const, fastener: fastener ?? "none" };
  return (
    <TornSheet as="figure" slip flush edge={how.edge} tilt={how.tilt} fastener={how.fastener} className={cn("code-block min-w-0", className)} data-numbers={numbers ? "" : undefined} data-slip="ruled" data-code="">
      {header && <figcaption className="code-head flex min-h-11 items-center justify-between gap-4 pr-2 pl-5">{header}</figcaption>}
      <div className={cn("code", !header && "pt-4")}>{children}</div>
    </TornSheet>
  );
}
