import Link from "next/link";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

type Page = { href: string; title: string };

/** The previous and next pages, in the sidebar's order. */
export function Pager({ prev, next }: { prev?: Page; next?: Page }) {
  return (
    <nav aria-label="More components" className="flex items-center justify-between gap-6 pt-4">
      {prev ? (
        <Link href={prev.href} className="group flex items-center gap-2 text-ink-2 transition-colors hover:text-ink">
          <InkGlyph name="arrow-right" className="rotate-180 transition-transform group-hover:-translate-x-0.5" />
          {prev.title}
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={next.href} className="group flex items-center gap-2 text-ink-2 transition-colors hover:text-ink">
          {next.title}
          <InkGlyph name="arrow-right" className="transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </nav>
  );
}
