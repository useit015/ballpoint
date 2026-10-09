"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { useInkStage } from "@/registry/ballpoint/hooks/use-ink-box";
import { Label } from "@/registry/ballpoint/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/ballpoint/ui/radio-group";
import { Switch } from "@/registry/ballpoint/ui/switch";
import { papers, pens, type PaperName, type PenName } from "@/registry/themes";
import { PaperSwatch } from "@/components/paper-swatch";
import { setNight, useNight } from "@/components/landing/night";
import { written } from "@/components/landing/guide";
import { contrast, parseColor } from "@/lib/color";
import { paperTile } from "@/lib/paper";

/** The specimen's sentence, written in when the pen gets to it, and again for each new pen or paper. */
function Sentence({ text }: { text: string }) {
  return (
    <p {...useInkStage()} className="text-2xl leading-snug">
      {written(text)}
    </p>
  );
}

/**
 * Small swatches of every pen and paper, and a specimen written in the one
 * picked, following day and night. A new pick swaps the colours at once and
 * draws the specimen again, with the same seeds, in the new ink.
 */
export function PenPicker() {
  const [pen, setPen] = useState<PenName>("blue");
  const [paper, setPaper] = useState<PaperName>("cream");
  const night = useNight();
  const mode = night ? "dark" : "light";
  const ink = pens[pen].ink;
  const sheet = papers[paper];
  const ratio = useMemo(() => contrast(parseColor(ink[mode]), parseColor(sheet.paper[mode])), [ink, sheet, mode]);

  return (
    <div className="flex flex-col">
      <RadioGroup value={pen} onValueChange={(v) => setPen(v as PenName)} aria-label="Pen" className="guide-swatches">
        {(Object.keys(pens) as PenName[]).map((name) => (
          <Label key={name}>
            <RadioGroupItem value={name} seed={`pick-pen-${name}`} />
            <svg aria-hidden="true" viewBox="0 0 40 10" className="h-3 w-9 overflow-visible" style={{ color: pens[name].ink[mode] }}>
              <path d="M1 7C8 2 13 9 20 5S32 2 39 4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
            </svg>
            {pens[name].title}
          </Label>
        ))}
      </RadioGroup>
      <RadioGroup value={paper} onValueChange={(v) => setPaper(v as PaperName)} aria-label="Paper" className="guide-swatches">
        {(Object.keys(papers) as PaperName[]).map((name) => (
          <Label key={name}>
            <RadioGroupItem value={name} seed={`pick-paper-${name}`} />
            <PaperSwatch paper={name} mode={mode} className="h-5 w-9" />
            {papers[name].title}
          </Label>
        ))}
      </RadioGroup>

      <div
        key={`${pen}-${paper}`}
        data-ink-scope=""
        role="group"
        aria-label="Specimen"
        className="paper-sheet sheet pen-scope paper-scope mt-(--paper-rule) flex max-w-xl flex-col gap-5 px-6 py-6 text-foreground sm:px-8 lg:rotate-[0.4deg]"
        style={
          {
            "--pen-day": ink.light,
            "--pen-night": ink.dark,
            "--paper-day": sheet.paper.light,
            "--paper-night": sheet.paper.dark,
            "--red-day": sheet.red.light,
            "--red-night": sheet.red.dark,
            "--tile-day": paperTile(paper, "light"),
            "--tile-night": paperTile(paper, "dark"),
          } as CSSProperties
        }
      >
        <Sentence text={`Written in ${pens[pen].title.toLowerCase()} on ${sheet.title.toLowerCase()} paper.`} />
        <Label className="w-fit">
          <Switch checked={night} onCheckedChange={(on, { event }) => void setNight(on, event.target as Element)} seed="pick-night" />
          At night
        </Label>
        <p className="text-sm text-ink-3" aria-live="polite">
          Text at {ratio.toFixed(1)} to 1, which passes WCAG AA.
        </p>
      </div>
    </div>
  );
}
