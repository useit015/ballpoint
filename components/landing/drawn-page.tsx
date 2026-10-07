import { Annotate } from "@/registry/ballpoint/ui/annotate";
import { Checklist, ChecklistItem } from "@/registry/ballpoint/ui/checklist";
import { MarginNote } from "@/registry/ballpoint/ui/margin-note";
import { Redact } from "@/registry/ballpoint/ui/redact";
import { SignaturePad } from "@/registry/ballpoint/ui/signature-pad";
import { allDocs } from "@/lib/docs";

/**
 * A page out of a notebook, written with the components that only make
 * sense drawn: marked up, a note in the margin, a word blacked out, a list
 * to tick off and a line to sign. Everything on it works.
 */
export function DrawnPage() {
  return (
    <article
      aria-label="A page of notes, made of Ballpoint components"
      className="paper-sheet sheet notebook relative flex w-full max-w-2xl flex-col gap-6 py-9 pr-6 pl-14 sm:pr-10 sm:pl-20 xl:max-w-none xl:-rotate-[0.4deg]"
    >
      <p className="text-ink-3">Friday</p>
      <h3 className="text-2xl font-bold">
        <Annotate type="underline" seed="np-title">
          Before v1 goes out
        </Annotate>
      </h3>
      <p className="max-w-[35ch] text-lg leading-[2rem] text-ink-2">
        Every component is{" "}
        <Annotate type="highlight" as="mark" seed="np-hand" delay={300}>
          drawn by hand
        </Annotate>
        , and the code name stays <Redact seed="np-codename">Blue Biro</Redact> until{" "}
        <MarginNote note="not a day sooner" seed="np-day-note" className="[--margin-note-gap:1.75rem] [--margin-note-width:6rem]">
          <Annotate type="circle" seed="np-day" delay={600} className="whitespace-nowrap">
            launch day
          </Annotate>
          .
        </MarginNote>
      </p>
      <Checklist defaultValue={["draw", "papers"]} aria-label="Before v1 goes out" className="text-lg">
        <ChecklistItem value="draw" seed="np-draw">
          Draw {allDocs.length} components
        </ChecklistItem>
        <ChecklistItem value="papers" seed="np-papers">
          Test every pen
        </ChecklistItem>
        <ChecklistItem value="tell" seed="np-tell">
          Tell people
        </ChecklistItem>
      </Checklist>
      <div className="flex max-w-sm flex-col gap-2 pt-2">
        <p className="text-ink-3">Signed off by</p>
        <SignaturePad seed="np-sign" label="Sign it off" placeholder="Sign here" />
      </div>
    </article>
  );
}
