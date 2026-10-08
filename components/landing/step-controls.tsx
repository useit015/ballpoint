"use client";

import { Button } from "@/registry/ballpoint/ui/button";
import { Label } from "@/registry/ballpoint/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/ballpoint/ui/radio-group";
import { Switch } from "@/registry/ballpoint/ui/switch";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import { papers, pens, type PaperName, type PenName } from "@/registry/themes";
import { PaperSwatch } from "@/components/paper-swatch";
import { useNight } from "@/components/landing/night";
import { useStory } from "@/components/landing/story";

/** Draws the stage's card again, in a fresh hand. */
export function RedrawButton() {
  const { redraw } = useStory();
  return (
    <Button variant="outline" seed="story-redraw" onClick={redraw} className="self-start">
      Draw it again <InkGlyph name="arrow-right" />
    </Button>
  );
}

/**
 * The stage's pen, paper and light, for the reader to pick: the stage's own,
 * not the page's. The pens are drawn on the page, so in its ink; the papers
 * are shown as the stage has them, by day or by night.
 */
export function PenControls() {
  const { theme, setTheme } = useStory();
  const pageNight = useNight();
  const night = theme.night ?? pageNight;
  const mode = night ? "dark" : "light";
  return (
    <div className="flex flex-col gap-5">
      <RadioGroup value={theme.pen} onValueChange={(v) => setTheme({ pen: v as PenName })} aria-label="Pen" className="flex flex-wrap gap-x-6 gap-y-3">
        {(Object.keys(pens) as PenName[]).map((name) => (
          <Label key={name}>
            <RadioGroupItem value={name} seed={`story-pen-${name}`} />
            <svg aria-hidden="true" viewBox="0 0 40 10" className="h-3 w-8 overflow-visible" style={{ color: pens[name].ink[pageNight ? "dark" : "light"] }}>
              <path d="M1 7C8 2 13 9 20 5S32 2 39 4" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" />
            </svg>
            {pens[name].title}
          </Label>
        ))}
      </RadioGroup>
      <RadioGroup value={theme.paper} onValueChange={(v) => setTheme({ paper: v as PaperName })} aria-label="Paper" className="flex flex-wrap gap-x-6 gap-y-3">
        {(Object.keys(papers) as PaperName[]).map((name) => (
          <Label key={name}>
            <RadioGroupItem value={name} seed={`story-paper-${name}`} />
            <PaperSwatch paper={name} mode={mode} className="h-5 w-8" />
            {papers[name].title}
          </Label>
        ))}
      </RadioGroup>
      <Label className="w-fit">
        <Switch checked={night} onCheckedChange={(on) => setTheme({ night: on })} seed="story-night" />
        At night
      </Label>
    </div>
  );
}
