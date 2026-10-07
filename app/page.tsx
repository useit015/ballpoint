import Link from "next/link";
import type { ReactNode } from "react";
import { Annotate } from "@/registry/ballpoint/ui/annotate";
import { Button } from "@/registry/ballpoint/ui/button";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import { ComponentArt } from "@/components/component-art";
import { Heading } from "@/components/heading";
import { InstallCommand } from "@/components/install-command";
import { IntentLink } from "@/components/intent-link";
import { TextLink } from "@/components/text-link";
import { Correction } from "@/components/landing/correction";
import { DrawnPage } from "@/components/landing/drawn-page";
import { InkedBlock } from "@/components/landing/inked-block";
import { HeroLine } from "@/components/landing/hero-line";
import { PenPicker } from "@/components/landing/pen-picker";
import { Redraw } from "@/components/landing/redraw";
import { Specimen } from "@/components/landing/specimen";
import { allDocs } from "@/lib/docs";
import { ruledItem } from "@/components/rule";
import { inkRules } from "@/registry/ballpoint/lib/ink";
import { homepage } from "@/registry/manifest";

// The shadcn/ui variants, each under the prop that draws it.
const variants = [
  { variant: "default", label: "Save" },
  { variant: "outline", label: "Export" },
  { variant: "secondary", label: "Draft" },
  { variant: "ghost", label: "More" },
  { variant: "destructive", label: "Delete" },
  { variant: "link", label: "Read more" },
] as const;

// A few of each kind for the strip above the full list.
const picks = ["button", "checkbox", "switch", "slider", "tabs", "dialog", "toast", "annotate", "margin-note", "signature-pad", "hatch-grid", "timeline"];

const code = "font-mono text-sm [font-variation-settings:'MONO'_1,'CASL'_1]";

/** A section's title: the registry's SectionHeading, in the hand rather than block capitals. */
function Title({ id, children }: { id: string; children: ReactNode }) {
  return (
    <Heading id={id} className="text-4xl tracking-normal text-balance normal-case sm:text-5xl lg:text-6xl">
      {children}
    </Heading>
  );
}

export default function Home() {
  const docs = new Map(allDocs.map((doc) => [doc.name, doc]));
  return (
    <main id="main" className="mx-auto flex w-full max-w-[85rem] flex-1 flex-col px-4 pb-28 sm:px-8">
      <Redraw>
        <section aria-labelledby="hero" className="relative flex flex-col gap-10 pt-8 pb-24 sm:gap-14 sm:pt-14 lg:pt-20 lg:pb-32">
          <h1 id="hero" className="sr-only">
            Ballpoint: shadcn-style components drawn in blue ballpoint
          </h1>
          <HeroLine />
          <div className="grid items-end gap-8 lg:grid-cols-[minmax(0,34rem)_minmax(0,1fr)] lg:gap-16">
            <p className="text-xl text-ink-2">
              The names and props you know from shadcn/ui, built on Base UI and installed with the shadcn CLI. Every line is a seeded pen
              stroke, drawn the same on the server and in the browser.
            </p>
            <div className="flex flex-wrap gap-5">
              <Button render={<Link href="/docs" />} nativeButton={false} size="lg" seed="hero-start">
                Get started <InkGlyph name="arrow-right" />
              </Button>
              <Button render={<Link href="/components" />} nativeButton={false} variant="outline" size="lg" seed="hero-browse">
                Browse components
              </Button>
            </div>
          </div>
        </section>

        <div className="flex flex-col gap-32 sm:gap-40">
          <section aria-labelledby="shadcn" className="flex flex-col gap-12 lg:gap-16">
            <div className="flex flex-col gap-10">
              <Title id="shadcn">Same names, same props</Title>
              <div className="text-[clamp(1.3rem,5.8vw,3.9rem)]">
                <Correction />
              </div>
            </div>
            <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:gap-20">
              <div className="flex flex-col gap-6">
                <p className="max-w-xl text-lg text-ink-2">
                  That&apos;s the only line that changes. Ballpoint is a shadcn registry: a component lands in{" "}
                  <code className="inline-code">components/ui</code> with the name, props and variants you already use, so an app built on
                  shadcn/ui keeps its code.
                </p>
                <p className="max-w-xl text-ink-3">
                  Each one is built on <TextLink href="https://base-ui.com">Base UI</TextLink>, so focus, keyboard and screen readers work the way
                  they do in shadcn/ui. Every page passes axe&apos;s WCAG 2.2 AA checks.
                </p>
              </div>
              <figure className="paper-sheet sheet flex flex-col px-6 pt-3 pb-5 sm:px-10 lg:rotate-[0.5deg]">
                <ul style={inkRules}>
                  {variants.map(({ variant, label }) => (
                    <li key={variant} className={`${ruledItem} flex min-h-20 items-center justify-between gap-6 py-4`}>
                      <Button variant={variant} seed={`variant-${variant}`}>
                        {label}
                      </Button>
                      <code className={`${code} text-ink-3`}>
                        variant=<span className="text-ink">&quot;{variant}&quot;</span>
                      </code>
                    </li>
                  ))}
                </ul>
                <figcaption className="pt-4 text-sm text-ink-3">
                  The six Button variants from shadcn/ui, each one drawn its own way.
                </figcaption>
              </figure>
            </div>
          </section>

          <section aria-labelledby="strokes" className="flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <Title id="strokes">Every line is a pen stroke</Title>
              <p className="max-w-2xl text-lg text-ink-2">
                Nothing here is an image or a border. Each line is generated from a seed: pulled a little off straight, run past its corners,
                gone over twice, the way a hand draws a box in a hurry.
              </p>
            </div>
            <Specimen />
          </section>

          <section aria-labelledby="drawn" className="grid items-start gap-12 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] xl:gap-20">
            <div className="flex flex-col gap-6 xl:sticky xl:top-10">
              <Title id="drawn">Things only a pen can do</Title>
              <p className="max-w-xl text-lg text-ink-2">
                Some components only make sense on paper. Mark up a sentence, leave a note in the margin, black out a word, tick off a list and
                sign at the bottom. All of it works on the page here: try it.
              </p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-lg">
                {["annotate", "margin-note", "redact", "checklist", "signature-pad", "scrawl", "timeline", "hatch-grid"].map((name) => (
                  <li key={name}>
                    <TextLink href={`/docs/${name}`}>{docs.get(name)?.title ?? name}</TextLink>
                  </li>
                ))}
              </ul>
            </div>
            <DrawnPage />
          </section>

          <section aria-labelledby="pens" className="flex flex-col gap-12">
            <div className="flex flex-col gap-6">
              <Title id="pens">Pens and papers, day and night</Title>
              <p className="max-w-2xl text-lg text-ink-2">
                Four pens and three papers, each with a night side. Every pair is checked against WCAG AA on every build, so a pale pen never
                ships on a pale page. <TextLink href="/customize">Mix your own</TextLink> in the customizer.
              </p>
            </div>
            <PenPicker />
          </section>

          <section aria-labelledby="components" className="flex flex-col gap-12">
            <Title id="components">{`${allDocs.length} components, and counting`}</Title>
            <ul className="grid grid-cols-3 gap-x-4 gap-y-8 sm:grid-cols-4 lg:grid-cols-6">
              {picks.map((name) => (
                <li key={name}>
                  <IntentLink href={`/docs/${name}`} className="group flex flex-col items-center gap-2 text-center">
                    <ComponentArt name={name} className="h-16 w-24 text-ink-3 transition-colors group-hover:text-ink" />
                    <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-ink-4">
                      {docs.get(name)?.title}
                    </span>
                  </IntentLink>
                </li>
              ))}
            </ul>
            <Button render={<Link href="/components" />} nativeButton={false} variant="outline" seed="all-components" className="self-start">
              See all {allDocs.length} <InkGlyph name="arrow-right" />
            </Button>
          </section>

          <section aria-labelledby="pen-down">
            <InkedBlock seed="pen-down" className="px-7 py-16 sm:px-14 sm:py-20 lg:px-20 lg:py-24">
              <div className="ink-land grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
                <div className="flex flex-col items-start gap-8">
                  <h2 id="pen-down" className="text-6xl leading-[0.95] font-bold sm:text-8xl">
                    Pick up the{" "}
                    <Annotate type="circle" seed="end-pen" delay={2100}>
                      pen
                    </Annotate>
                    .
                  </h2>
                  <p className="max-w-md text-xl text-ink-2">
                    Two commands, and the first component is in your app, yours to change.
                  </p>
                  <div className="flex flex-wrap gap-5">
                    <Button render={<Link href="/docs" />} nativeButton={false} size="lg" seed="end-start">
                      Get started <InkGlyph name="arrow-right" />
                    </Button>
                    <Button render={<Link href="/customize" />} nativeButton={false} variant="outline" size="lg" seed="end-customize">
                      Mix your own pen
                    </Button>
                  </div>
                  <p className="max-w-md text-ink-2">
                    Working with a coding assistant? Point it at <TextLink href="/llms.txt">llms.txt</TextLink>, or{" "}
                    <TextLink href="/llms-full.txt">llms-full.txt</TextLink> for every component&apos;s props in one file.
                  </p>
                </div>
                <ol className="flex min-w-0 flex-col gap-9 lg:pt-3">
                  <li className="flex flex-col gap-3">
                    <p className="text-lg">Set up the paper and ink, once:</p>
                    <div data-ink-scope="" className="inked-unturn">
                      <InstallCommand what={`init ${homepage}/r/ballpoint.json`} />
                    </div>
                  </li>
                  <li className="flex flex-col gap-3">
                    <p className="text-lg">Then add a component whenever you need one:</p>
                    <div data-ink-scope="" className="inked-unturn">
                      <InstallCommand what="add @ballpoint/button" />
                    </div>
                  </li>
                </ol>
              </div>
            </InkedBlock>
          </section>
        </div>
      </Redraw>
    </main>
  );
}
