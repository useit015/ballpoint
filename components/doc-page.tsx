import type { ReactNode } from "react";
import { Toc, type TocItem } from "@/components/toc";

/** A docs page: the article, and on wide screens its contents beside it. */
export function DocPage({ toc, children }: { toc: TocItem[]; children: ReactNode }) {
  return (
    <div className="min-[1440px]:grid min-[1440px]:grid-cols-[minmax(0,48rem)_11rem] min-[1440px]:gap-12">
      <article className="flex min-w-0 max-w-3xl flex-col gap-14">{children}</article>
      <aside className="hidden min-[1440px]:sticky min-[1440px]:top-6 min-[1440px]:block min-[1440px]:self-start">
        <Toc items={toc} />
      </aside>
    </div>
  );
}
