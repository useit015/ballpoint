import { DocsNav } from "@/components/docs-nav";
import { navGroups } from "@/lib/nav";

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="mx-auto flex w-full max-w-[85rem] flex-1 gap-10 px-4 pt-6 pb-24 sm:px-8 md:gap-16">
      {/* Phones and tablets open the contents from the menu in the header. */}
      {/* Sticky, and scrolls on its own when the list is taller than the window. */}
      <aside className="hidden md:sticky md:top-6 md:-mt-2 md:-ml-4 md:block md:max-h-[calc(100dvh-3rem)] md:w-52 md:shrink-0 md:self-start md:overflow-y-auto md:overscroll-contain md:pt-2 md:pb-6 md:pl-4">
        <DocsNav groups={navGroups} />
      </aside>
      <main id="main" className="min-w-0 flex-1">
        {children}
      </main>
    </div>
  );
}
