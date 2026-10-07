import Link from "next/link";
import { Button } from "@/registry/ballpoint/ui/button";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

type Page = { href: string; title: string };

/** The previous and next pages, in the sidebar's order. */
export function Pager({ prev, next }: { prev?: Page; next?: Page }) {
  return (
    <nav aria-label="More components" className="flex items-stretch justify-between gap-4 pt-4">
      {prev ? (
        <Button render={<Link href={prev.href} />} nativeButton={false} variant="outline" size="lg" seed="pager-prev" className="h-auto min-w-0 flex-col items-start gap-0.5 py-3 text-left">
          <span className="flex items-center gap-1.5 text-sm text-ink-3">
            <InkGlyph name="arrow-right" className="size-3.5 rotate-180" />
            Previous
          </span>
          <span className="truncate">{prev.title}</span>
        </Button>
      ) : (
        <span />
      )}
      {next && (
        <Button render={<Link href={next.href} />} nativeButton={false} variant="outline" size="lg" seed="pager-next" className="h-auto min-w-0 flex-col items-end gap-0.5 py-3 text-right">
          <span className="flex items-center gap-1.5 text-sm text-ink-3">
            Next
            <InkGlyph name="arrow-right" className="size-3.5" />
          </span>
          <span className="truncate">{next.title}</span>
        </Button>
      )}
    </nav>
  );
}
