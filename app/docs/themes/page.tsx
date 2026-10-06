import type { Metadata } from "next";
import Link from "next/link";
import { Heading } from "@/components/heading";
import { InstallCommand } from "@/components/install-command";
import { papers, pens } from "@/registry/themes";

export const metadata: Metadata = { title: "Pens and papers" };

function Stroke({ ink }: { ink: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 80 12" className="h-4 w-20 overflow-visible" style={{ color: ink }}>
      <path d="M2 8C14 2 24 11 38 6S62 2 78 5" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" />
    </svg>
  );
}

export default function ThemesPage() {
  return (
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-5">
        <Heading as="h1" id="themes" className="text-3xl">
          Pens and papers
        </Heading>
        <p className="text-lg text-ink-2">
          A pen sets the ink; a paper sets the paper and the red pen that shows up on it. Mix any of them: every pair passes WCAG AA by day
          and by night, checked on every build. Try them together in the{" "}
          <Link href="/customize" className="underline decoration-ink-4 underline-offset-4 hover:decoration-ink">
            customizer
          </Link>
          .
        </p>
      </header>

      <section className="flex flex-col gap-6">
        <Heading id="pens">Pens</Heading>
        {Object.entries(pens).map(([name, pen]) => (
          <div key={name} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <h3 className="font-bold">{pen.title}</h3>
              <span className="flex items-center gap-2 rounded-sm px-2 py-1" style={{ background: papers.cream.paper.light }}>
                <Stroke ink={pen.ink.light} />
              </span>
              <span className="flex items-center gap-2 rounded-sm px-2 py-1" style={{ background: papers.cream.paper.dark }}>
                <Stroke ink={pen.ink.dark} />
              </span>
            </div>
            <p className="text-ink-2">{pen.description}</p>
            <InstallCommand what={`add @ballpoint/pen-${name}`} />
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <Heading id="papers">Papers</Heading>
        {Object.entries(papers).map(([name, paper]) => (
          <div key={name} className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
              <h3 className="font-bold">{paper.title}</h3>
              {(["light", "dark"] as const).map((mode) => (
                <span
                  key={mode}
                  aria-hidden="true"
                  className="h-6 w-16 border border-ink-line"
                  style={{ background: paper.paper[mode], borderRadius: "var(--hand-radius)" }}
                />
              ))}
            </div>
            <p className="text-ink-2">{paper.description}</p>
            <InstallCommand what={`add @ballpoint/paper-${name}`} />
          </div>
        ))}
      </section>
    </article>
  );
}
