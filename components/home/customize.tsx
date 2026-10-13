"use client";

import { useEffect, useId, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { penStyle, useInkFrame, useInkSeed, useInkStage } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { penBoxStrokes } from "@/registry/ballpoint/lib/ink-sketch";
import { Button } from "@/registry/ballpoint/ui/button";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Input } from "@/registry/ballpoint/ui/input";
import { Label } from "@/registry/ballpoint/ui/label";
import { Switch } from "@/registry/ballpoint/ui/switch";
import { papers, pens, type PaperName, type PenName } from "@/registry/themes";
import { contrast, parseColor } from "@/lib/color";
import { cn } from "@/lib/utils";
import { paperTile, slipTile } from "@/lib/paper";
import { inkBlot, setNight, useNight } from "@/components/home/night";
import { Callout } from "@/components/home/callout";
import { SideArt } from "@/components/home/side-art";
import { written } from "@/components/home/write";

const penNames = Object.keys(pens) as PenName[];
const paperNames = Object.keys(papers) as PaperName[];

/** A card that is one of a set of radio buttons: boxed in the pen when it is the one picked. */
function Pick({ name, value, label, checked, onPick, seed, className, children }: { name: string; value: string; label: string; checked: boolean; onPick: (from: Element) => void; seed: string; className?: string; children: ReactNode }) {
  const s = useInkSeed(seed);
  const { ref, w, h, frame } = useInkFrame([150, 84], { pad: 7 });
  const paths = useMemo(() => penBoxStrokes(s, w, h, { roughness: 1, passes: 2, corners: "crossed" }), [s, w, h]);
  return (
    <label data-checked={checked ? "" : undefined} className={`pick ${className ?? ""}`}>
      <input type="radio" name={name} value={value} checked={checked} onChange={(e) => onPick(e.currentTarget.closest("label") ?? e.currentTarget)} className="sr-only" aria-label={label} />
      <InkSvg ref={ref} {...frame} className="pick-box text-ink" style={{ ...frame.style, ...penStyle({}) }}>
        {paths.map((d, i) => (
          <Stroke key={i} d={d} draw="checked" delay={i * 120} duration={[380, 320][i] ?? 300} width={[1.7, 1.2][i] ?? 1} opacity={[1, 0.7][i] ?? 0.5} />
        ))}
      </InkSvg>
      {children}
    </label>
  );
}

/** A scribble of a pen's ink, in its day and night colours. */
function Scribble({ pen, id }: { pen: PenName; id: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 26" className="pick-scribble" style={{ "--c-day": pens[pen].ink.light, "--c-night": pens[pen].ink.dark } as CSSProperties}>
      <path d="M3 18C7 6 12 5 14 12C16 19 19 21 22 10C24 3 28 4 29 11C30 18 33 20 37 11C39 6 43 7 44 12C45 17 49 18 52 9C54 4 58 6 61 7" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" id={id} />
    </svg>
  );
}

/** The specimen's sentence, written in when the pen gets to it, and again for each new pen or paper. */
function Sentence({ text }: { text: string }) {
  return (
    <p {...useInkStage()} className="custom-sentence">
      {written(text)}
    </p>
  );
}


/**
 * Dress the whole page in a pen and a paper: the choice is written on <html>
 * (the rules that read it are in app/home.css), so every drawing, every
 * control and the sheet itself follow, by day and by night. The default pair
 * leaves no trace.
 */
function dress(pen: PenName, paper: PaperName) {
  const root = document.documentElement;
  const ink = pens[pen].ink;
  const sheet = papers[paper];
  const set = (name: string, value: string) => root.style.setProperty(name, value);
  const clear = (...names: string[]) => names.forEach((n) => root.style.removeProperty(n));
  if (pen === "blue") {
    root.removeAttribute("data-pen");
    clear("--pen-day", "--pen-night");
  } else {
    root.setAttribute("data-pen", pen);
    set("--pen-day", ink.light);
    set("--pen-night", ink.dark);
  }
  if (paper === "cream") {
    root.removeAttribute("data-paper");
    clear("--paper-day", "--paper-night", "--red-day", "--red-night", "--tile-day", "--tile-night", "--slip-tile-day", "--slip-tile-night");
  } else {
    root.setAttribute("data-paper", paper);
    set("--paper-day", sheet.paper.light);
    set("--paper-night", sheet.paper.dark);
    set("--red-day", sheet.red.light);
    set("--red-night", sheet.red.dark);
    set("--tile-day", paperTile(paper, "light"));
    set("--tile-night", paperTile(paper, "dark"));
    set("--slip-tile-day", slipTile(paper, "light"));
    set("--slip-tile-night", slipTile(paper, "dark"));
  }
}

/**
 * Pens, papers and a night side. A pick changes the colours of the specimen
 * and of the night panel at once, and draws the specimen again, with the same
 * seeds, in the new ink. Everything here follows day and night by CSS, so
 * nothing flashes the wrong colour while the page loads.
 */
export function Customize() {
  const [pen, setPen] = useState<PenName>("blue");
  const [paper, setPaper] = useState<PaperName>("cream");
  const at = useNight();
  const group = useId();
  // The page goes back to its own pen and paper when this section leaves it.
  useEffect(() => () => dress("blue", "cream"), []);
  const choose = (next: { pen?: PenName; paper?: PaperName }, from: Element) => {
    const [p, q] = [next.pen ?? pen, next.paper ?? paper];
    void inkBlot(() => {
      dress(p, q);
      flushSync(() => {
        setPen(p);
        setPaper(q);
      });
    }, from);
  };
  const sheet = papers[paper];
  const ink = pens[pen].ink;

  const ratios = useMemo(
    () => ({
      light: contrast(parseColor(ink.light), parseColor(sheet.paper.light)),
      dark: contrast(parseColor(ink.dark), parseColor(sheet.paper.dark)),
    }),
    [ink, sheet],
  );

  const scope = {
    "--pen-day": ink.light,
    "--pen-night": ink.dark,
    "--paper-day": sheet.paper.light,
    "--paper-night": sheet.paper.dark,
    "--red-day": sheet.red.light,
    "--red-night": sheet.red.dark,
    "--tile-day": paperTile(paper, "light"),
    "--tile-night": paperTile(paper, "dark"),
  } as CSSProperties;

  // The panel shows the side the page is not on: night on a day page, day on a night one.
  const side = at ? "day" : "night";
  const face = (
    side === "night"
      ? { "--ink": ink.dark, "--paper": sheet.paper.dark, "--pen-red": sheet.red.dark, "--paper-tile": paperTile(paper, "dark"), "--ink-fill": 0.72 }
      : { "--ink": ink.light, "--paper": sheet.paper.light, "--pen-red": sheet.red.light, "--paper-tile": paperTile(paper, "light"), "--ink-fill": 0.78 }
  ) as CSSProperties;

  return (
    <div className="custom" style={scope}>
      <div className="custom-pens">
        <h3 id={`${group}-pens`} className="custom-label">
          Pens
        </h3>
        <div role="radiogroup" aria-labelledby={`${group}-pens`} className="pick-row pick-row-4">
          {penNames.map((name) => (
            <Pick key={name} name={`${group}-pen`} value={name} label={pens[name].title} checked={pen === name} onPick={(from) => choose({ pen: name }, from)} seed={`pick-pen-${name}`}>
              <Scribble pen={name} id={`${group}-${name}`} />
              <span className="pick-name">{pens[name].title}</span>
            </Pick>
          ))}
        </div>
      </div>

      <div className="custom-papers">
        <h3 id={`${group}-papers`} className="custom-label">
          Paper
        </h3>
        <div role="radiogroup" aria-labelledby={`${group}-papers`} className="pick-row pick-row-3">
          {paperNames.map((name) => (
            <Pick key={name} name={`${group}-paper`} value={name} label={papers[name].title} checked={paper === name} onPick={(from) => choose({ paper: name }, from)} seed={`pick-paper-${name}`}>
              <span
                aria-hidden="true"
                className="paper-sheet sheet paper-scope pick-paper"
                style={{ "--paper-day": papers[name].paper.light, "--paper-night": papers[name].paper.dark, "--tile-day": paperTile(name, "light"), "--tile-night": paperTile(name, "dark"), "--red-day": papers[name].red.light, "--red-night": papers[name].red.dark } as CSSProperties}
              />
              <span className="pick-name">{papers[name].title}</span>
            </Pick>
          ))}
        </div>
      </div>

      <aside className={cn("custom-night paper-sheet sheet", side === "night" ? "dark as-night" : "as-day")} data-ink-scope="" style={face} aria-label={side === "night" ? "The night side" : "The day side"}>
        <h3 className="custom-label">{side === "night" ? "Night side" : "Day side"}</h3>
        <div className="custom-night-art">
          <SideArt side={side} />
        </div>
        <p className="custom-night-line">Same components. Different mood.</p>
        <div className="night-row">
          <Label id="night-control" className="w-fit">
            <Switch checked={at} onCheckedChange={(on, { event }) => void setNight(on, event.target as Element)} seed="pick-night" />
            Turn the page to night
          </Label>
          <Callout lines={["Flip it."]} target="night-control" bend={0.32} seed="night-callout" delay={300} className="night-callout" />
        </div>
      </aside>

      <div key={`${pen}-${paper}`} className="custom-specimen paper-sheet sheet pen-scope paper-scope" data-ink-scope="" role="group" aria-label="Specimen">
        <Sentence text={`${pens[pen].title} on ${sheet.title.toLowerCase()}.`} />
        <div className="custom-controls">
          <Input type="email" placeholder="you@domain.com" aria-label="Email" seed="custom-email" className="w-60 max-w-full" />
          <Label className="w-fit">
            <Checkbox defaultChecked seed="custom-check" />
            Send me updates
          </Label>
          <Button seed="custom-subscribe">Subscribe</Button>
        </div>
        <p className="custom-ratio" aria-live="polite">
          Passes WCAG AA by day ({ratios.light.toFixed(1)} to 1) and by night ({ratios.dark.toFixed(1)} to 1).
        </p>
      </div>
    </div>
  );
}
