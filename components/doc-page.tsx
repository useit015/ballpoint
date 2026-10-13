import type { ReactNode } from "react";
import { Toc, type TocItem } from "@/components/toc";

/** A docs page: the article, and on wide screens its contents beside it. */
export function DocPage({ toc, children }: { toc: TocItem[]; children: ReactNode }) {
  return (
    <div className="doc">
      <article className="doc-article">{children}</article>
      <aside className="doc-toc-cell">
        <Toc items={toc} />
      </aside>
    </div>
  );
}
