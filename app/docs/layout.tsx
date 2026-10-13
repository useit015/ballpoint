import "../art.css";
import "../docs.css";
import "../sheets.css";
import "../torn.css";
import { DocsNav } from "@/components/docs-nav";
import { SideScroll } from "@/components/side-scroll";
import { navGroups } from "@/lib/nav";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="docs-shell">
      {/* Phones and tablets open the contents from the menu in the header. */}
      <div className="docs-side-cell">
        <aside className="docs-side">
          <SideScroll>
            <DocsNav groups={navGroups} />
          </SideScroll>
        </aside>
        <span aria-hidden="true" className="docs-rule" />
      </div>
      <main id="main" className="min-w-0">
        {children}
      </main>
    </div>
  );
}
