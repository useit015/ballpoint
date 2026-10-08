import type { CSSProperties, ReactNode } from "react";
import { Annotate } from "@/registry/ballpoint/ui/annotate";
import { Checklist, ChecklistItem } from "@/registry/ballpoint/ui/checklist";
import { MarginNote } from "@/registry/ballpoint/ui/margin-note";
import { Paper } from "@/registry/ballpoint/ui/paper";
import { Redact } from "@/registry/ballpoint/ui/redact";
import { SignaturePad } from "@/registry/ballpoint/ui/signature-pad";
import { papers, type PaperName } from "@/registry/themes";
import { paperTile } from "@/lib/paper";
import { cn } from "@/lib/utils";
import { TextLink } from "@/components/text-link";

/** A sheet of one of the papers, by day and by night (.paper-scope in globals.css). */
const sheetOf = (paper: PaperName) =>
  ({
    "--paper-day": papers[paper].paper.light,
    "--paper-night": papers[paper].paper.dark,
    "--red-day": papers[paper].red.light,
    "--red-night": papers[paper].red.dark,
    "--tile-day": paperTile(paper, "light"),
    "--tile-night": paperTile(paper, "dark"),
  }) as CSSProperties;

/**
 * One cell: a different sheet for each component that only makes sense
 * drawn, the component working on it, and its name underneath.
 */
function Cell({
  name,
  title,
  note,
  paper = "cream",
  variant = "plain",
  className,
  children,
}: {
  name: string;
  title: string;
  note: string;
  paper?: PaperName;
  variant?: "plain" | "ruled" | "grid" | "dots";
  className?: string;
  children: ReactNode;
}) {
  return (
    <li className={cn("bento-cell rise", className)}>
      <Paper
        data-ink-scope=""
        variant={variant}
        lifted
        className="paper-scope flex h-full flex-col justify-between gap-8 px-6 pt-7 pb-5 sm:px-8 sm:pt-9"
        style={sheetOf(paper)}
      >
        <div className="flex flex-col gap-4">{children}</div>
        <p className="text-sm text-ink-3">
          <TextLink href={`/docs/${name}`} className="font-bold text-ink-2">
            {title}
          </TextLink>{" "}
          {note}
        </p>
      </Paper>
    </li>
  );
}

/** The components only a pen can draw, each on its own sheet, all of them working. */
export function PenBento() {
  return (
    <ul className="grid gap-5 sm:gap-6 lg:grid-cols-6">
      <Cell name="annotate" title="Annotate" note="underlines, circles, strikes and shades words in." variant="ruled" className="lg:col-span-4">
        <p className="max-w-[30ch] text-3xl leading-[2rem] sm:text-4xl sm:leading-[3rem] [--paper-rule:3rem]">
          We ship on{" "}
          <Annotate type="circle" seed="bento-friday">
            Friday
          </Annotate>
          ,{" "}
          <Annotate type="strike" as="del" delay={500} seed="bento-monday">
            or Monday
          </Annotate>
          . Thank{" "}
          <Annotate type="highlight" as="mark" delay={900} seed="bento-everyone">
            everyone
          </Annotate>{" "}
          who{" "}
          <Annotate type="underline" delay={1300} seed="bento-helped">
            helped
          </Annotate>
          .
        </p>
      </Cell>

      <Cell name="checklist" title="Checklist" note="strikes a line through each thing done." paper="legal" variant="ruled" className="lg:col-span-2">
        <p className="text-xl font-bold">Before Friday</p>
        <Checklist defaultValue={["proof"]} aria-label="Before Friday" className="text-lg">
          <ChecklistItem value="proof" seed="bento-proof">
            Proofread the docs
          </ChecklistItem>
          <ChecklistItem value="plant" seed="bento-plant">
            Water the plant
          </ChecklistItem>
          <ChecklistItem value="pens" seed="bento-pens">
            Buy more blue pens
          </ChecklistItem>
        </Checklist>
      </Cell>

      <Cell name="margin-note" title="Margin Note" note="writes an aside and points at what it's about." className="lg:col-span-2">
        <p className="text-xl leading-relaxed lg:mr-[8.5rem]">
          Every box is four pulls of the pen, and{" "}
          <MarginNote note="took three tries" seed="bento-note" className="[--margin-note-gap:1.5rem] [--margin-note-width:7rem]">
            the corners cross
          </MarginNote>
          .
        </p>
      </Cell>

      <Cell name="redact" title="Redact" note="scribbles words out until they're clicked." variant="grid" paper="white" className="lg:col-span-2">
        <p className="text-xl leading-relaxed">
          The code name is <Redact seed="bento-codename">Blue Biro</Redact>, and it goes out on <Redact seed="bento-date">the 14th</Redact>.
        </p>
      </Cell>

      <Cell name="signature-pad" title="Signature Pad" note="inks a signature like a ballpoint." variant="dots" className="lg:col-span-2">
        <SignaturePad seed="bento-sign" label="Sign it off" placeholder="Sign it off" />
      </Cell>
    </ul>
  );
}
