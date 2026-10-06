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
      links: allDocs.filter((doc) => doc.group === group).map((doc) => ({ href: `/docs/${doc.name}`, title: doc.title })),
    }))
    .filter((group) => group.links.length),
];

export default function DocsLayout({ children }: LayoutProps<"/docs">) {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-4 pt-6 pb-24 sm:px-8 md:flex-row md:gap-16">
      {/* Phones get the contents folded away above the page. */}
      <details className="md:hidden">
        <summary className="cursor-pointer text-ink-2">Contents</summary>
        <div className="pt-4">
          <DocsNav groups={groups} />
        </div>
      </details>
      <aside className="hidden md:sticky md:top-8 md:block md:w-48 md:shrink-0 md:self-start">
        <DocsNav groups={groups} />
      </aside>
      <main id="main" className="min-w-0 max-w-3xl flex-1">
        {children}
      </main>
    </div>
  );
}
