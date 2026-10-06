import type { Metadata } from "next";
import Link from "next/link";
import { Heading } from "@/components/heading";
import { PaperSheet, PenSheet } from "@/components/theme-sheets";
import { papers, pens, type PaperName } from "@/registry/themes";

export const metadata: Metadata = { title: "Pens and papers" };

export default function ThemesPage() {
  return (
    <article className="flex flex-col gap-14">
      <header className="flex flex-col gap-4">
        <Heading as="h1" id="themes" className="text-3xl">
          Pens and papers
        </Heading>
        <p className="text-lg text-ink-2">
          A pen sets the ink; a paper sets the paper and the red pen that shows up on it. Add one of each and every component picks them
          up. Any pair passes WCAG AA by day and by night, checked on every build.
        </p>
        <p className="text-ink-3">
          Switch the lamp in the corner to see them at night, or mix your own in the{" "}
          <Link href="/customize" className="underline decoration-ink-4 underline-offset-4 hover:decoration-ink">
            customizer
          </Link>
          .
        </p>
      </header>

      <section className="flex flex-col gap-8">
        <Heading id="pens">Pens</Heading>
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {Object.entries(pens).map(([name, pen], i) => (
            <PenSheet key={name} name={name} pen={pen} index={i} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-8">
        <Heading id="papers">Papers</Heading>
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2">
          {(Object.keys(papers) as PaperName[]).map((name, i) => (
            <PaperSheet key={name} name={name} paper={papers[name]} index={i + 1} />
          ))}
        </div>
      </section>
    </article>
  );
}
