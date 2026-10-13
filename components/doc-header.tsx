import Link from "next/link";
import type { ReactNode } from "react";
import { Heading } from "@/components/heading";

export type Crumb = { title: string; href?: string };

/**
 * The top of a docs page: where it sits, its title written in, what it is in
 * a line, and (beside them) a small sketch of it. `children` is for tags and links.
 */
export function DocHeader({ crumbs, id, title, lede, art, children }: { crumbs: Crumb[]; id: string; title: string; lede: ReactNode; art?: ReactNode; children?: ReactNode }) {
  return (
    <header className="doc-head">
      <nav aria-label="Breadcrumb" className="doc-crumbs">
        <ol>
          {crumbs.map((c) => (
            <li key={c.title} aria-current={c.href ? undefined : "page"}>
              {c.href ? <Link href={c.href}>{c.title}</Link> : c.title}
            </li>
          ))}
        </ol>
      </nav>
      <Heading as="h1" id={id}>
        {title}
      </Heading>
      <p className="doc-lede">{lede}</p>
      {children && <div className="doc-meta">{children}</div>}
      {art && <div aria-hidden="true" className="doc-head-art">{art}</div>}
    </header>
  );
}
