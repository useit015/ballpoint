import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import { Heading } from "@/components/heading";
import { InstallCommand } from "@/components/install-command";
import { homepage } from "@/registry/manifest";

export const metadata: Metadata = { title: "Installation" };

const tokens = [
  ["--paper", "The page. Cream by day, navy by night."],
  ["--ink", "The pen. Text, strokes, focus rings."],
  ["--ink-2, --ink-3", "Lighter pressure for secondary and muted text. Both clear 4.5:1."],
  ["--ink-line", "Control borders: the lightest pressure that clears 3:1."],
  ["--ink-4, --ink-5", "Decoration only: rules, washes, hatching."],
  ["--pen-red", "The only other pen, for destructive and invalid states."],
  ["--ink-fill", "How solid a pen-shaded fill is under its strokes."],
];

export default function Installation() {
  return (
    <article className="flex flex-col gap-8">
      <header className="flex flex-col gap-5">
        <Heading as="h1" id="installation" className="text-3xl">
          Installation
        </Heading>
        <p className="text-lg text-ink-2">
          Ballpoint is a shadcn registry. You copy the components into your app and own them. It needs React 19 and Tailwind CSS 4; the
          examples assume Next.js.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <Heading id="init">1. Set up the paper and ink</Heading>
        <p className="text-ink-2">
          In an app that already has Tailwind CSS 4, run init with the Ballpoint base. It writes the colour, type and motion tokens into your
          global CSS, adds Gaegu with <code className="font-mono text-sm">next/font</code>, copies the stroke engine into{" "}
          <code className="font-mono text-sm">lib/</code> and <code className="font-mono text-sm">hooks/</code>, and registers the{" "}
          <code className="font-mono text-sm">@ballpoint</code> namespace in <code className="font-mono text-sm">components.json</code>.
        </p>
        <InstallCommand what={`init ${homepage}/r/ballpoint.json`} />
      </section>

      <section className="flex flex-col gap-4">
        <Heading id="add">2. Add components</Heading>
        <InstallCommand what="add @ballpoint/button" />
        <CodeBlock
          code={`import { Button } from "@/components/ui/button"

<Button>Book a call</Button>`}
        />
      </section>

      <section className="flex flex-col gap-4">
        <Heading id="theming">Theming</Heading>
        <p className="text-ink-2">
          Everything is one ink at different pressures, mixed toward the paper in oklab so the hue never drifts. Change{" "}
          <code className="font-mono text-sm">--ink</code> and <code className="font-mono text-sm">--paper</code> and the rest follows. The
          usual shadcn names (<code className="font-mono text-sm">--background</code>, <code className="font-mono text-sm">--primary</code>,{" "}
          <code className="font-mono text-sm">--border</code>, …) are mapped onto these, so shadcn blocks sit on the same page.
        </p>
        <dl className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
          {tokens.map(([name, what]) => (
            <div key={name} className="contents">
              <dt className="font-mono text-sm leading-7 text-ink">{name}</dt>
              <dd className="text-ink-2">{what}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="flex flex-col gap-4">
        <Heading id="drawing">Drawing</Heading>
        <p className="text-ink-2">
          Strokes are generated from a seed, so a component draws the same wobble on the server and in the browser. Pass{" "}
          <code className="font-mono text-sm">seed</code> to pin one; otherwise each instance gets its own. Components that can draw
          themselves in take <code className="font-mono text-sm">draw=&quot;mount&quot;</code>. With reduced motion, everything appears already
          drawn. Wrap part of a page in <code className="font-mono text-sm">InkSeedProvider</code> to redraw it all in a different hand.
        </p>
        <CodeBlock
          code={`import { InkSeedProvider } from "@/hooks/use-ink-box"

<InkSeedProvider salt="monday">
  <Toolbar />
</InkSeedProvider>`}
        />
      </section>
    </article>
  );
}
