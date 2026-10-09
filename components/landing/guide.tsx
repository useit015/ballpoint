import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/registry/ballpoint/ui/separator";

/**
 * One numbered part of the front page's field guide: its number printed in
 * the margin and, after the first, a line drawn across the sheet above it.
 * It prints its own rules (.guide-part in app/globals.css).
 */
export function Part({
  n,
  label,
  id,
  className,
  children,
}: {
  n: string;
  /** Printed over the number, in the margin, where there's room. */
  label: string;
  /** The id of the part's title. */
  id: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className={cn("guide-part", className)}>
      {n !== "01" && <Separator seed={`guide-${n}`} className="guide-break" />}
      <p aria-hidden="true" className="guide-index">
        <span className="guide-index-label">{label}</span>
        <span>{n}</span>
      </p>
      {children}
    </section>
  );
}

/**
 * Words written in one after another, from `at` ms, about as fast as a hand
 * writes them. Each is its own element, so a margin note's words wait for
 * its arrow (they sit right beside its drawing) and wrap like words.
 */
export function written(text: string, at = 0) {
  let t = at;
  return text.split(" ").flatMap((word, i) => {
    const d = 90 + word.length * 34;
    const style = { "--ink-d": `${d}ms`, "--ink-dd": `${Math.round(t)}ms` } as CSSProperties;
    t += d * 0.75 + 40;
    return [
      i > 0 ? " " : null,
      <span key={i} className="ink-write inline-block" style={style}>
        {word}
      </span>,
    ];
  });
}
