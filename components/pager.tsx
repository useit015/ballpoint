import Link from "next/link";
import { Card } from "@/registry/ballpoint/ui/card";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

type Page = { href: string; title: string };

/** The previous and next pages, in the sidebar's order: two pencilled cards, each one link. */
export function Pager({ prev, next }: { prev?: Page; next?: Page }) {
  return (
    <nav aria-label="More components" className="pager">
      {prev ? (
        <Card seed="pager-prev" data-dir="prev" className="pager-card">
          <Link href={prev.href} className="pager-link">
            <span className="pager-kind">
              <InkGlyph name="arrow-right" className="size-4 rotate-180" />
              Previous
            </span>
            <span className="pager-title">{prev.title}</span>
          </Link>
        </Card>
      ) : (
        <span />
      )}
      {next && (
        <Card seed="pager-next" data-dir="next" className="pager-card">
          <Link href={next.href} className="pager-link">
            <span className="pager-kind">
              Next
              <InkGlyph name="arrow-right" className="size-4" />
            </span>
            <span className="pager-title">{next.title}</span>
          </Link>
        </Card>
      )}
    </nav>
  );
}
