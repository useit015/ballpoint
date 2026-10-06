import type { ReactNode } from "react";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

/** A <details> with a drawn chevron that turns as it opens. */
export function Disclosure({ summary, children }: { summary: ReactNode; children: ReactNode }) {
  return (
    <details className="group">
      <summary className="flex w-fit cursor-pointer list-none items-center gap-2 text-ink-2 transition-colors hover:text-ink [&::-webkit-details-marker]:hidden">
        <InkGlyph name="chevron-right" className="size-3.5 transition-transform duration-(--dur-state) group-open:rotate-90 motion-reduce:transition-none" />
        {summary}
      </summary>
      <div className="mt-4 flex flex-col gap-4">{children}</div>
    </details>
  );
}
