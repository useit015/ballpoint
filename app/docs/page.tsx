import type { Metadata } from "next";
import { CodeBlock } from "@/components/code-block";
import { DocPage } from "@/components/doc-page";
import { TextLink } from "@/components/text-link";
import type { TocItem } from "@/components/toc";
import { Alert, AlertDescription, AlertTitle } from "@/registry/ballpoint/ui/alert";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import { Heading } from "@/components/heading";
import { InstallCommand } from "@/components/install-command";
import { PropsTable } from "@/components/props-table";
import { penProps, tokens } from "@/lib/docs";
import { homepage } from "@/registry/manifest";

export const metadata: Metadata = { title: "Installation" };

const toc: TocItem[] = [
  { id: "init", title: "1. Set up the paper and ink" },
  { id: "add", title: "2. Add components" },
  { id: "theming", title: "Theming" },
  { id: "pen", title: "Pen settings" },
];

export default function Installation() {
  return (
    <DocPage toc={toc}>
      <header className="flex flex-col gap-4">
        <Heading as="h1" id="installation" className="text-3xl">
          Installation
        </Heading>
        <p className="text-lg text-ink-2">
          Ballpoint is a shadcn registry. You copy the components into your app and own them.
        </p>
        <Alert seed="requirements">
          <InkGlyph name="info-circle" className="size-5" />
          <AlertTitle>Before you start</AlertTitle>
          <AlertDescription>React 19 and Tailwind CSS 4. The examples assume Next.js, but nothing in the components needs it.</AlertDescription>
        </Alert>
      </header>

      <section className="flex flex-col gap-5">
        <Heading id="init">1. Set up the paper and ink</Heading>
        <p className="text-ink-2">
          In an app that already has Tailwind CSS 4, run init with the Ballpoint base. It writes the colour, type and motion tokens into your
          global CSS, adds Gaegu with <code className="inline-code">next/font</code>, copies the stroke engine into{" "}
          <code className="inline-code">lib/</code> and <code className="inline-code">hooks/</code>, and registers the{" "}
          <code className="inline-code">@ballpoint</code> namespace in <code className="inline-code">components.json</code>.
        </p>
        <InstallCommand what={`init ${homepage}/r/ballpoint.json`} />
      </section>

      <section className="flex flex-col gap-5">
        <Heading id="add">2. Add components</Heading>
        <InstallCommand what="add @ballpoint/button" />
        <CodeBlock
          code={`import { Button } from "@/components/ui/button"

<Button>Book a call</Button>`}
        />
      </section>

      <section className="flex flex-col gap-5">
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
          <TextLink href="/docs/themes">pens and papers</TextLink>
          , or try them together in the{" "}
          <TextLink href="/customize">customizer</TextLink>
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

      <section className="flex flex-col gap-5">
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
        <PropsTable props={penProps} />
        <p className="text-ink-2">Weight and speed are plain CSS variables too:</p>
        <CodeBlock
          lang="css"
          code={`:root {
  --ink-weight: 1.2; /* heavier pen everywhere */
  --ink-speed: 0.8;  /* draw a little slower */
}`}
        />
      </section>
    </DocPage>
  );
}
