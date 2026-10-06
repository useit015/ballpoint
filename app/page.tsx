import Link from "next/link";
import { Button } from "@/registry/ballpoint/ui/button";
import { inkRules } from "@/registry/ballpoint/lib/ink";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import { InstallCommand } from "@/components/install-command";
import { Heading } from "@/components/heading";
import { Showcase } from "@/components/showcase";
import { allDocs } from "@/lib/docs";
import { homepage } from "@/registry/manifest";

const components = [...allDocs].sort((a, b) => a.title.localeCompare(b.title));

// Each entry is ruled off underneath by hand, like the rows of a list in a notebook.
const rule =
  "relative after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-[2.5px] after:h-[5px] after:bg-ink-4 after:[mask-image:var(--ink-rule-1)] after:[mask-size:100%_100%] after:[mask-repeat:no-repeat] nth-[3n+2]:after:[mask-image:var(--ink-rule-2)] nth-[3n]:after:[mask-image:var(--ink-rule-3)]";

export default function Home() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-24 px-4 pt-10 pb-28 sm:px-8 sm:pt-16">
      <section className="grid items-start gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)] lg:gap-20">
        <div className="flex flex-col gap-7">
          <Heading as="h1" id="ballpoint" className="text-5xl tracking-normal normal-case">
            Ballpoint
          </Heading>
          <p className="max-w-xl text-xl text-ink-2">
            shadcn-style components drawn in blue ballpoint. Same names and props as shadcn/ui, built on Base UI, installed with the shadcn
            CLI.
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

      <section className="flex max-w-3xl flex-col gap-6">
        <Heading id="install">Install</Heading>
        <p className="text-lg text-ink-2">One command sets up the paper, the ink and the font; then add components one by one.</p>
        <InstallCommand what={`init ${homepage}/r/ballpoint.json`} />
      </section>

      <section className="flex flex-col gap-8">
        <Heading id="components">Components</Heading>
        <ul className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3" style={inkRules}>
          {components.map((doc) => (
            <li key={doc.name} className={rule}>
              <Link href={`/docs/${doc.name}`} className="group flex h-full flex-col gap-1 py-4 pr-2">
                <span className="text-lg font-bold underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-ink-4">
                  {doc.title}
                </span>
                <span className="text-sm text-ink-3">{doc.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
