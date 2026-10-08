import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Annotate } from "@/registry/ballpoint/ui/annotate";
import { Button } from "@/registry/ballpoint/ui/button";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import { Heading } from "@/components/heading";
import { InstallCommand } from "@/components/install-command";
import { TextLink } from "@/components/text-link";
import { CardCode } from "@/components/landing/card-code";
import { ComponentMarquee } from "@/components/landing/component-marquee";
import { Correction } from "@/components/landing/correction";
import { InkedBlock } from "@/components/landing/inked-block";
import { PenBento } from "@/components/landing/pen-bento";
import { Stage } from "@/components/landing/stage";
import { PenControls, RedrawButton } from "@/components/landing/step-controls";
import { Story, StoryStep } from "@/components/landing/story";
import { allDocs } from "@/lib/docs";
import { homepage } from "@/registry/manifest";

/** Words written in one after another, from `at` ms, about as fast as a hand writes them. */
function Written({ words, at, className }: { words: string[]; at: number; className?: string }) {
  let t = at;
  return words.map((word, i) => {
    const d = 90 + word.length * 32;
    const style = { "--ink-d": `${d}ms`, "--ink-dd": `${t}ms` } as CSSProperties;
    t += d * 0.7 + 30;
    return (
      <span key={i}>
        <span className={`ink-write inline-block ${className ?? ""}`} style={style}>
          {word}
        </span>{" "}
      </span>
    );
  });
}

/** A step's title and what it says, over whatever it gives the reader to try. */
function StepText({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <>
      <h2 id={id} className="text-4xl leading-[1.05] font-bold text-balance sm:text-5xl">
        {title}
      </h2>
      <p className="max-w-[34ch] text-xl text-ink-2">{children}</p>
    </>
  );
}

export default function Home() {
  const count = allDocs.length;
  return (
    <main id="main" className="mx-auto flex w-full max-w-[85rem] flex-1 flex-col px-4 sm:px-8">
      <Story className="story relative flex flex-col lg:grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-x-12 xl:gap-x-16">
        <section data-step="hero" aria-labelledby="hero" className="story-hero flex flex-col justify-center gap-8 pt-6 pb-10 sm:pt-10 lg:min-h-[calc(100dvh-5.5rem)] lg:pt-0 lg:pb-24">
          <h1 id="hero" className="text-[2.75rem] leading-[1.05] font-bold tracking-tight sm:text-7xl xl:text-[4.6rem]">
            <span className="block">
              <Written words={["Components", "drawn"]} at={60} />
            </span>
            <span className="block">
              <Written words={["in"]} at={600} />
              <Annotate type="underline" draw="mount" delay={1250} seed="hero-underline">
                <Written words={["blue", "ballpoint."]} at={690} />
              </Annotate>
            </span>
          </h1>
          <p className="ink-land max-w-[30ch] text-xl text-ink-2 sm:text-2xl" style={{ "--ink-d": "600ms", "--ink-dd": "900ms" } as CSSProperties}>
            The names and props you know from shadcn/ui, on Base UI. Every line is a seeded pen stroke.
          </p>
          <div className="ink-land flex flex-wrap gap-5" style={{ "--ink-d": "600ms", "--ink-dd": "1100ms" } as CSSProperties}>
            <Button render={<Link href="/docs" />} nativeButton={false} size="lg" draw="mount" seed="hero-start">
              Get started <InkGlyph name="arrow-right" />
            </Button>
            <Button render={<Link href="/components" />} nativeButton={false} variant="outline" size="lg" draw="mount" seed="hero-browse">
              Browse components
            </Button>
          </div>
        </section>

        <div className="story-stage lg:col-start-2 lg:row-span-5 lg:row-start-1">
          <Stage count={count} code={<CardCode count={count} />} />
        </div>

        <StoryStep id="names" className="flex flex-col justify-center gap-6">
          <StepText id="names" title="Same names, same props.">
            Swap the registry and keep your code. Each component lands in <code className="inline-code">components/ui</code> with the props you already pass.
          </StepText>
          <div className="text-[clamp(1.15rem,4.6vw,2.2rem)]">
            <Correction />
          </div>
        </StoryStep>

        <StoryStep id="strokes" className="flex flex-col justify-center gap-6">
          <StepText id="strokes" title="Every line is a pen stroke.">
            No images and no borders. Each line comes from a seed, so the server and the browser draw the same wobble.
          </StepText>
          <RedrawButton />
        </StoryStep>

        <StoryStep id="fit" className="story-fit flex flex-col justify-center gap-6">
          <StepText id="fit" title="Redrawn to fit, never stretched.">
            Change a box&apos;s size and its lines are drawn again for the new one. One ResizeObserver watches the whole page.
          </StepText>
        </StoryStep>

        <StoryStep id="pens" className="flex flex-col justify-center gap-7">
          <StepText id="pens" title="Any pen, any paper, day or night.">
            Four pens and three papers, each with a night side. Every pair passes WCAG AA, checked on every build.
          </StepText>
          <PenControls />
          <p className="text-ink-3">
            Or <TextLink href="/customize">mix your own</TextLink> in the customizer.
          </p>
        </StoryStep>
      </Story>

      <section aria-labelledby="drawn" className="flex flex-col gap-12 pt-28 sm:pt-40">
        <div className="flex flex-col gap-6">
          <Heading id="drawn" className="text-4xl tracking-normal text-balance normal-case sm:text-5xl lg:text-6xl">
            Things only a pen can do
          </Heading>
          <p className="max-w-[44ch] text-xl text-ink-2">Some components only make sense on paper. Every one of these works: try them.</p>
        </div>
        <PenBento />
      </section>

      <section aria-labelledby="components" className="flex flex-col gap-12 pt-32 sm:pt-44">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          <Heading id="components" className="text-4xl tracking-normal text-balance normal-case sm:text-5xl lg:text-6xl">
            {`${count} components, and counting`}
          </Heading>
          <Button render={<Link href="/components" />} nativeButton={false} variant="outline" seed="all-components">
            Browse components <InkGlyph name="arrow-right" />
          </Button>
        </div>
        <ComponentMarquee />
      </section>

      <section aria-labelledby="pen-down" className="pt-32 pb-24 sm:pt-44 sm:pb-32">
        <InkedBlock seed="pen-down" className="finale px-6 py-20 sm:px-14 sm:py-24 lg:px-20 lg:py-28">
          <div className="ink-land mx-auto grid max-w-[85rem] gap-14 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
            <div className="flex flex-col items-start gap-8">
              <h2 id="pen-down" className="text-6xl leading-[0.95] font-bold sm:text-8xl">
                Pick up the{" "}
                <Annotate type="circle" seed="end-pen" delay={2100}>
                  pen
                </Annotate>
                .
              </h2>
              <p className="max-w-md text-xl text-ink-2">Two commands, and the first component is in your app, yours to change.</p>
              <Button render={<Link href="/docs" />} nativeButton={false} size="lg" seed="end-start">
                Get started <InkGlyph name="arrow-right" />
              </Button>
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
    </main>
  );
}
