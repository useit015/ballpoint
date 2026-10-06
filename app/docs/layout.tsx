import { Disclosure } from "@/components/disclosure";
import { DocsNav, type NavGroup } from "@/components/docs-nav";
import { allDocs } from "@/lib/docs";

const groups: NavGroup[] = [
  {
    title: "Start",
    links: [
      { href: "/docs", title: "Installation" },
      { href: "/docs/themes", title: "Pens and papers" },
      { href: "/customize", title: "Customize" },
    ],
  },
  ...(["Components", "Drawn"] as const)
    .map((group) => ({
      title: group,
      links: allDocs
        .filter((doc) => doc.group === group)
        .map((doc) => ({ href: `/docs/${doc.name}`, title: doc.title }))
        .sort((a, b) => a.title.localeCompare(b.title)),
    }))
    .filter((group) => group.links.length),
];

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 pt-6 pb-24 sm:px-8 md:flex-row md:gap-16">
      {/* Phones get the contents folded away above the page. */}
      <div className="md:hidden">
        <Disclosure summary="Contents">
          <DocsNav groups={groups} />
        </Disclosure>
      </div>
      {/* Sticky, and scrolls on its own when the list is taller than the window. */}
      <aside className="hidden md:sticky md:top-6 md:-mt-2 md:-ml-4 md:block md:max-h-[calc(100dvh-3rem)] md:w-52 md:shrink-0 md:self-start md:overflow-y-auto md:overscroll-contain md:pt-2 md:pb-6 md:pl-4 md:[scrollbar-color:var(--ink-4)_transparent] md:[scrollbar-width:thin]">
        <DocsNav groups={groups} />
      </aside>
      <main id="main" className="min-w-0 max-w-3xl flex-1">
        {children}
      </main>
    </div>
  );
}
