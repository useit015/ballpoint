import type { Metadata } from "next";
import Link from "next/link";
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
          global CSS, adds Gaegu with <code className="inline-code">next/font</code>, copies the stroke engine into{" "}
          <code className="inline-code">lib/</code> and <code className="inline-code">hooks/</code>, and registers the{" "}
          <code className="inline-code">@ballpoint</code> namespace in <code className="inline-code">components.json</code>.
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
          <code className="inline-code">--ink</code> and <code className="inline-code">--paper</code> and the rest follows. The
          usual shadcn names (<code className="inline-code">--background</code>, <code className="inline-code">--primary</code>,{" "}
          <code className="inline-code">--border</code>, …) are mapped onto these, so shadcn blocks sit on the same page.
        </p>
        <p className="text-ink-2">
          Other pens and papers install the same way, for example{" "}
          <code className="inline-code">add @ballpoint/pen-black @ballpoint/paper-white</code>. See{" "}
          <Link href="/docs/themes" className="underline decoration-ink-4 underline-offset-4 hover:decoration-ink">
            pens and papers
          </Link>
          , or try them together in the{" "}
          <Link href="/customize" className="underline decoration-ink-4 underline-offset-4 hover:decoration-ink">
            customizer
          </Link>
          .
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
        <Heading id="pen">Pen settings</Heading>
        <p className="text-ink-2">
          Strokes are generated from a seed, so a component draws the same wobble on the server and in the browser; pass{" "}
          <code className="inline-code">seed</code> to pin one. By default everything draws itself in the first time it scrolls into
          view (<code className="inline-code">draw=&quot;auto&quot;</code>); with reduced motion it appears already drawn.
        </p>
        <p className="text-ink-2">
          How the pen behaves is yours to set, per component or for a whole region: roughness, how many passes, corner radius (pills
          included), crossed or joined corners, how areas are coloured in, the shadow, line weight and drawing speed. A{" "}
          <code className="inline-code">salt</code> redraws everything inside in a slightly different hand.
        </p>
        <CodeBlock
          title="app/layout.tsx"
          code={`import { InkProvider } from "@/hooks/use-ink-box"

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <InkProvider radius={10} roughness={0.8} fill="hatch">
          {children}
        </InkProvider>
      </body>
    </html>
  )
}`}
        />
        <p className="text-ink-2">Weight and speed are plain CSS variables too:</p>
        <CodeBlock
          lang="css"
          code={`:root {
  --ink-weight: 1.2; /* heavier pen everywhere */
  --ink-speed: 0.8;  /* draw a little slower */
}`}
        />
      </section>
    </article>
  );
}
