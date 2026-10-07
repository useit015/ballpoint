import Link from "next/link";
import { Button } from "@/registry/ballpoint/ui/button";
import { Annotate } from "@/registry/ballpoint/ui/annotate";
import { InkIcon, type IconName } from "@/registry/ballpoint/ui/ink-icons";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import { inkRules } from "@/registry/ballpoint/lib/ink";
import { InstallCommand } from "@/components/install-command";
import { Heading } from "@/components/heading";
import { ComponentArt } from "@/components/component-art";
import { Showcase } from "@/components/showcase";
import { ruledItem } from "@/components/rule";
import { ordered } from "@/lib/nav";
import { homepage } from "@/registry/manifest";

const features: { icon: IconName; title: string; text: string }[] = [
  { icon: "copy", title: "Same names, same props", text: "Built on Base UI and installed with the shadcn CLI. Swap an import and your app is drawn by hand." },
  { icon: "pencil", title: "Every line is a pen stroke", text: "Seeded, so the server and the browser draw the same wobble. Redrawn to fit, and drawn in as it scrolls into view." },
  { icon: "sun", title: "Pens, papers, day and night", text: "Pick an ink and a paper, or mix your own. Every pair clears WCAG AA in light and dark, checked on every build." },
];

const groups = [
  { title: "Components", id: "components", blurb: "The everyday set, with the names and props you know from shadcn/ui." },
  { title: "Drawn", id: "drawn", blurb: "Only here: marks, margins and pages that make sense because they are drawn." },
] as const;

export default function Home() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-[85rem] flex-1 flex-col gap-24 px-4 pt-10 pb-28 sm:px-8 sm:pt-16">
      <section className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-20">
        <div className="flex flex-col gap-7">
          <Heading as="h1" id="ballpoint" className="text-5xl tracking-normal normal-case">
            Ballpoint
          </Heading>
          <p className="max-w-xl text-xl text-ink-2">
            shadcn-style components{" "}
            <Annotate type="underline" seed="hero-drawn" delay={500}>
              drawn in blue ballpoint
            </Annotate>
            . Same names and props as shadcn/ui, built on Base UI, installed with the shadcn CLI.
          </p>
          <p className="max-w-xl text-lg text-ink-3">
            Every line is a seeded pen stroke: the same on the server and in the browser, redrawn to fit, and drawn in as it comes into
            view.
          </p>
          <div className="flex flex-wrap gap-5 pt-1">
            <Button render={<Link href="/docs" />} nativeButton={false} size="lg" seed="hero-start" draw="mount">
              Get started <InkGlyph name="arrow-right" />
            </Button>
            <Button render={<Link href="/customize" />} nativeButton={false} variant="outline" size="lg" seed="hero-customize" draw="mount">
              Try your own pen
            </Button>
          </div>
        </div>
        <Showcase />
      </section>

      <section aria-label="Why Ballpoint">
        <ul className="grid gap-x-12 gap-y-10 md:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.title} className="flex flex-col gap-3">
              <InkIcon name={feature.icon} draw="auto" className="size-7 text-ink-2" />
              <h3 className="text-xl font-bold">{feature.title}</h3>
              <p className="text-ink-2">{feature.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex max-w-3xl flex-col gap-6">
        <Heading id="install">Install</Heading>
        <p className="text-lg text-ink-2">One command sets up the paper, the ink and the font; then add components one by one.</p>
        <InstallCommand what={`init ${homepage}/r/ballpoint.json`} />
      </section>

      {groups.map((group) => {
        const docs = ordered.filter((doc) => doc.group === group.title);
        return (
          <section key={group.id} className="flex flex-col gap-6">
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
