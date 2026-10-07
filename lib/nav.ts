import { allDocs, type Doc } from "@/lib/docs";

export type NavLink = { href: string; title: string };
export type NavGroup = { title: string; links: NavLink[] };

export const startLinks: NavLink[] = [
  { href: "/docs", title: "Installation" },
  { href: "/docs/themes", title: "Pens and papers" },
  { href: "/customize", title: "Customize" },
];

const byTitle = (a: Doc, b: Doc) => a.title.localeCompare(b.title);
const groupNames = ["Components", "Drawn"] as const;

/** The docs in the sidebar's order: each group, A to Z. */
export const ordered: Doc[] = groupNames.flatMap((group) => allDocs.filter((doc) => doc.group === group).sort(byTitle));

export const navGroups: NavGroup[] = [
  { title: "Start", links: startLinks },
  ...groupNames
    .map((title) => ({
      title,
      links: ordered.filter((doc) => doc.group === title).map((doc) => ({ href: `/docs/${doc.name}`, title: doc.title })),
    }))
    .filter((group) => group.links.length),
];

/** Everything the search finds. */
export const searchEntries = [
  ...startLinks.map((link) => ({ ...link, group: "Start", description: "" })),
  ...ordered.map((doc) => ({ href: `/docs/${doc.name}`, title: doc.title, group: doc.group, description: doc.description })),
];

export function neighbours(name: string) {
  const at = ordered.findIndex((doc) => doc.name === name);
  const link = (doc?: Doc) => doc && { href: `/docs/${doc.name}`, title: doc.title };
  return { prev: link(ordered[at - 1]), next: link(ordered[at + 1]) };
}
