import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Annotate } from "@/registry/ballpoint/ui/annotate";
import { Button } from "@/registry/ballpoint/ui/button";
import { Checklist, ChecklistItem } from "@/registry/ballpoint/ui/checklist";
import { MarginNote } from "@/registry/ballpoint/ui/margin-note";
import { Paper } from "@/registry/ballpoint/ui/paper";
import { Redact } from "@/registry/ballpoint/ui/redact";
import { Scrawl } from "@/registry/ballpoint/ui/scrawl";
import { SectionHeading } from "@/registry/ballpoint/ui/section-heading";
import { SignaturePad } from "@/registry/ballpoint/ui/signature-pad";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import type { UnderlineShape } from "@/registry/ballpoint/lib/ink-sketch";
import { InstallCommand } from "@/components/install-command";
import { ApiSlip } from "@/components/landing/api-slip";
import { Part, written } from "@/components/landing/guide";
import { PenPicker } from "@/components/landing/pen-picker";
import { homepage } from "@/registry/manifest";

/** A part's title, written in and underlined as it comes into view. */
function Title({ id, underline, children }: { id: string; underline: UnderlineShape; children: string }) {
  return (
    <div className="guide-title-block">
      <SectionHeading id={id} seed={`${id}-title`} underline={underline} speed={1.5} className="guide-title text-4xl tracking-normal normal-case sm:text-5xl">
        {children}
      </SectionHeading>
    </div>
  );
}

/** A note in the margin naming the component that made the mark beside it. */
function Named({ name, children }: { name: string; children: ReactNode }) {
  return (
    <MarginNote note={written(name, 640)} seed={`named-${name}`} className="guide-note">
      {children}
    </MarginNote>
  );
}

export default function Home() {
  return (
    <main id="main" className="mx-auto w-full max-w-[85rem] flex-1 px-4 pt-2 pb-24 sm:px-8 sm:pt-4">
      <Paper margin lifted seed="guide" className="guide">
        <Part n="01" label="Field guide" id="hero" className="guide-hero">
          <h1 id="hero" className="guide-headline">
            <span className="block">An interface</span>{" "}
            <span className="block">you can write on.</span>
          </h1>
          <p className="guide-lede">
            The{" "}
            <Annotate type="underline" draw="mount" delay={120} seed="hero-know">
              components you know
            </Annotate>{" "}
            from shadcn/ui,
            <br /> built on Base&nbsp;UI and{" "}
            <MarginNote note={written("Every outline comes from a seed.", 640)} seed="hero-seed" className="guide-note guide-hero-note">
              drawn with a ballpoint.
            </MarginNote>
          </p>
          <div className="guide-actions">
            <Button render={<Link href="/docs" />} nativeButton={false} size="lg" seed="hero-start">
              Get started <InkGlyph name="arrow-right" />
            </Button>
            <Button render={<Link href="/components" />} nativeButton={false} variant="outline" size="lg" seed="hero-browse">
              Browse components
            </Button>
          </div>
        </Part>

        <Part n="02" label="On paper" id="on-paper">
          <Title id="on-paper" underline="swoosh">A page with a point of view.</Title>
          <div className="guide-column">
            <p className="text-ink-2">
              Some components only make sense on paper. Every mark below is one of them, named in the margin. Try them.
            </p>
            <p className="guide-line guide-gap">
              Everything here is written on one ruled <Named name="Paper">sheet.</Named>
            </p>
            <p className="guide-line">
              Underline{" "}
              <Annotate type="underline" seed="paper-matters">
                what matters
              </Annotate>{" "}
              and circle what you&apos;d{" "}
              <Named name="Annotate">
                <Annotate type="circle" seed="paper-change">
                  change
                </Annotate>
                .
              </Named>
            </p>
            <p className="guide-line">
              Leave a note beside the line it&apos;s <Named name="Margin Note">about.</Named>
            </p>
            <p className="guide-line">
              Click to see when we launch:{" "}
              <Named name="Redact">
                <Redact label="The launch date" seed="paper-date">
                  the 14th
                </Redact>
                .
              </Named>
            </p>
            <div className="guide-gap relative">
              <span className="guide-doodle" aria-hidden="true">
                <Scrawl kind="star" seed="paper-star" className="guide-doodle-star" />
                <span className="guide-doodle-label ink-land" style={{ "--ink-d": "300ms", "--ink-dd": "700ms" } as CSSProperties}>
                  Scrawl
                </span>
              </span>
              <p className="guide-line">
                Before <Named name="Checklist">Friday:</Named>
              </p>
              <Checklist defaultValue={["ink"]} aria-label="Before Friday" className="guide-checklist">
                <ChecklistItem value="ink" seed="paper-ink">
                  Set up the paper and ink
                </ChecklistItem>
                <ChecklistItem value="button" seed="paper-button">
                  Add a button
                </ChecklistItem>
                <ChecklistItem value="sign" seed="paper-sign">
                  Sign it off
                </ChecklistItem>
              </Checklist>
            </div>
            <p className="guide-line guide-gap">
              Signed, <Named name="Signature Pad">by you.</Named>
            </p>
            <SignaturePad label="Your signature" seed="paper-signature" className="guide-signature" />
          </div>
        </Part>

        <Part n="03" label="The API" id="api">
          <Title id="api" underline="double">Under the ink, a familiar API.</Title>
          <div className="guide-column">
            <p className="text-ink-2">The code you&apos;d write with shadcn/ui, and what it draws.</p>
          </div>
          <ApiSlip className="guide-figure" />
        </Part>

        <Part n="04" label="Yours" id="yours">
          <Title id="yours" underline="loop">Make the page yours.</Title>
          <div className="guide-column">
            <p className="text-ink-2">
              Four pens and three papers, each with a night side, and every pair passes WCAG AA. Pick one, then put the paper and ink in your app with one command.
            </p>
          </div>
          <div className="guide-gap flex flex-col gap-(--paper-rule)">
            <PenPicker />
            <div className="max-w-3xl" data-ink-scope="">
              <InstallCommand what={`init ${homepage}/r/ballpoint.json`} />
            </div>
          </div>
        </Part>
      </Paper>
    </main>
  );
}
