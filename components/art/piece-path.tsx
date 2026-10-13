import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { UNIT, type Piece } from "@/lib/art/kit";

/** One stroke of a scene. Living things use it too, for the parts of them that are simply drawn. */
export function PiecePath({ p, unit = UNIT }: { p: Piece; unit?: number }) {
  return (
    <path
      d={p.d}
      pathLength={p.how === "draw" ? 1 : undefined}
      data-down={p.down ? "" : undefined}
      className={cn(p.how === "draw" ? "art-draw" : "art-sweep", p.only && `art-${p.only}`, p.cls)}
      style={{ "--w": p.w * unit, "--o": p.o ?? 1, "--d": `${Math.round(p.dur)}ms`, "--dd": `${Math.round(p.at)}ms`, ...p.vars } as CSSProperties}
    />
  );
}
