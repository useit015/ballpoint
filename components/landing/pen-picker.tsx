"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { Badge } from "@/registry/ballpoint/ui/badge";
import { Button } from "@/registry/ballpoint/ui/button";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Field, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";
import { Label } from "@/registry/ballpoint/ui/label";
import { Progress, ProgressLabel, ProgressValue } from "@/registry/ballpoint/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/registry/ballpoint/ui/radio-group";
import { PaperSwatch } from "@/components/paper-swatch";
import { Switch } from "@/registry/ballpoint/ui/switch";
import { setNight, useNight } from "@/components/landing/night";
import { contrast, parseColor } from "@/lib/color";
import { paperTile } from "@/lib/paper";
import { papers, pens, type PaperName, type PenName } from "@/registry/themes";

/**
 * The same little form in any pen on any paper, following day and night,
 * with the contrast of the pair on show: a taste of the customizer.
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
    <div className="grid gap-8 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] md:gap-10">
      <div className="flex flex-col gap-7">
        <RadioGroup value={pen} onValueChange={(v) => setPen(v as PenName)} aria-label="Pen" className="gap-2.5">
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
        <RadioGroup value={paper} onValueChange={(v) => setPaper(v as PaperName)} aria-label="Paper" className="gap-2.5">
          {(Object.keys(papers) as PaperName[]).map((name) => (
            <Label key={name}>
              <RadioGroupItem value={name} seed={`pick-paper-${name}`} />
              <PaperSwatch paper={name} mode={mode} className="h-5 w-9" />
              {papers[name].title}
            </Label>
          ))}
        </RadioGroup>
        <Label>
          <Switch checked={night} onCheckedChange={(on, { event }) => void setNight(on, event.target as Element)} seed="pick-night" />
          Night
        </Label>
      </div>

      <div className="flex flex-col gap-3">
        <div
          data-ink-scope=""
          aria-label="Preview"
          role="group"
          className="paper-sheet sheet pen-scope paper-scope flex flex-col gap-6 px-6 py-7 text-foreground sm:px-8 lg:rotate-[0.3deg]"
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
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-xl font-bold">Reading list</p>
            <Badge variant="outline" seed="pick-badge">
              3 left
            </Badge>
          </div>
          <Field>
            <FieldLabel htmlFor="pick-book">Add a book</FieldLabel>
            <Input id="pick-book" placeholder="The Elements of Typographic Style" seed="pick-input" />
          </Field>
          <div className="flex flex-col gap-2.5">
            <Label>
              <Checkbox defaultChecked seed="pick-check-1" />
              Thinking, Fast and Slow
            </Label>
            <Label>
              <Checkbox seed="pick-check-2" />
              The Design of Everyday Things
            </Label>
          </div>
          <Progress value={40} seed="pick-progress">
            <ProgressLabel className="text-sm">This year</ProgressLabel>
            <ProgressValue />
          </Progress>
          <div className="flex flex-wrap gap-4">
            <Button seed="pick-save">Save</Button>
            <Button variant="ghost" seed="pick-cancel">
              Cancel
            </Button>
          </div>
        </div>
        <p className="text-sm text-ink-3" aria-live="polite">
          {pens[pen].title} on {sheet.title.toLowerCase()} {night ? "at night" : "by day"}: text at {ratio.toFixed(1)} to 1, which passes WCAG AA.
        </p>
      </div>
    </div>
  );
}
