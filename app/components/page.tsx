import type { Metadata } from "next";
import Link from "next/link";
import { inkRules } from "@/registry/ballpoint/lib/ink";
import { ComponentArt } from "@/components/component-art";
import { Heading } from "@/components/heading";
import { ruledItem } from "@/components/rule";
import { TextLink } from "@/components/text-link";
import { ordered } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Components",
  description: "Every Ballpoint component, from Accordion to Tooltip, and the ones only a pen can draw.",
};

const groups = [
  { title: "Components", id: "everyday", blurb: "The everyday set, with the names and props you know from shadcn/ui." },
  { title: "Drawn", id: "drawn", blurb: "Only here: marks, margins and pages that make sense because they are drawn." },
] as const;

export default function Components() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-[85rem] flex-1 flex-col gap-20 px-4 pt-10 pb-28 sm:px-8 sm:pt-16">
      <header className="flex max-w-2xl flex-col gap-5">
        <Heading as="h1" id="components" className="text-4xl tracking-normal normal-case sm:text-5xl">
          Components
        </Heading>
        <p className="text-lg text-ink-2">
          {ordered.length} components, each added on its own with the shadcn CLI. Start with the{" "}
          <TextLink href="/docs">installation</TextLink>, then pick what you need.
        </p>
      </header>

      {groups.map((group) => {
        const docs = ordered.filter((doc) => doc.group === group.title);
        return (
          <section key={group.id} aria-labelledby={group.id} className="flex flex-col gap-6">
            <Heading id={group.id}>{group.title}</Heading>
            <p className="max-w-2xl text-lg text-ink-2">{group.blurb}</p>
            <ul className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3" style={inkRules}>
              {docs.map((doc) => (
                <li key={doc.name} className={ruledItem}>
                  <Link href={`/docs/${doc.name}`} className="group flex h-full items-center gap-4 py-4 pr-2">
                    <ComponentArt name={doc.name} className="h-[3.75rem] w-[5.5rem] text-ink-3 transition-colors group-hover:text-ink" />
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="text-lg font-bold underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-ink-4">
                        {doc.title}
                      </span>
                      <span className="text-sm text-ink-3">{doc.description}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
