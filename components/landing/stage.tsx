"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { InkProvider } from "@/registry/ballpoint/hooks/use-ink-box";
import { hashSeed } from "@/registry/ballpoint/lib/ink-sketch";
import { papers, pens } from "@/registry/themes";
import { contrast, parseColor } from "@/lib/color";
import { paperTile } from "@/lib/paper";
import { useNight } from "@/components/landing/night";
import { LaunchCard, startDone, tasks } from "@/components/landing/launch-card";
import { defaultTheme, useStory, type StageTheme } from "@/components/landing/story";
import { WritingPen, type PenRest } from "@/components/landing/writing-pen";

// The pen the story's last step shows off, one after another, until the
// reader picks one for themselves.
const showreel: Partial<StageTheme>[] = [
  { pen: "black", paper: "white" },
  { pen: "green", paper: "legal" },
  { pen: "pencil", paper: "white", night: true },
  { pen: "blue", paper: "cream", night: true },
  { pen: "blue", paper: "cream", night: null },
];

// Put down on the sheet, below the card and to the right, lying flatter than it's held.
const rest = (w: number, h: number): PenRest => ({ x: w - Math.min(150, w * 0.3), y: h - 22, turn: 30 });

/**
 * The sheet beside the story, with the card on it and the pen that draws
 * it. Each step does something to it: the card turns over to show its
 * code, is drawn again in a fresh hand, is squeezed and redrawn to fit, and
 * goes through the pens and papers by day and night.
 */
export function Stage({ count, code }: { count: number; code: ReactNode }) {
  const { step, take, redraw, theme, setTheme, chosen } = useStory();
  const [done, setDone] = useState(startDone);
  const [shipped, setShipped] = useState(false);
  const pageNight = useNight();
  const night = theme.night ?? pageNight;
  const mode = night ? "dark" : "light";

  // Entering the strokes step draws the card again, in a new hand.
  useEffect(() => {
    if (step === "strokes") redraw();
  }, [step, redraw]);

  // The pens step plays through a few pens and papers until the reader picks
  // one; leaving it, an untouched stage goes back to the page's own.
  useEffect(() => {
    if (chosen) return;
    if (step !== "pens" || matchMedia("(prefers-reduced-motion: reduce)").matches) return void setTheme(defaultTheme, "story");
    let i = 0;
    const next = () => setTheme(showreel[i++ % showreel.length], "story");
    const first = setTimeout(next, 350);
    const every = setInterval(next, 1800);
    return () => {
      clearTimeout(first);
      clearInterval(every);
    };
  }, [step, chosen, setTheme]);

  const ship = (on: boolean) => {
    setShipped(on);
    setDone(on ? tasks(count).map((task) => task.value) : startDone);
  };

  const ink = pens[theme.pen].ink[mode];
  const paper = papers[theme.paper];
  const sheet = {
    "--stage-ink": ink,
    "--stage-paper": paper.paper[mode],
    "--stage-red": paper.red[mode],
    "--ink": "var(--stage-ink)",
    "--paper": "var(--stage-paper)",
    "--pen-red": "var(--stage-red)",
    "--paper-tile": paperTile(theme.paper, mode),
  } as CSSProperties;

  return (
    <div data-stage-step={step} className="stage relative">
      <div
        data-ink-scope=""
        className={`stage-sheet paper-sheet sheet relative flex h-full flex-col text-ink ${night ? "dark" : ""}`}
        style={sheet}
      >
        <div className="stage-flip relative flex flex-1 items-center justify-center px-4 pt-4 pb-3 sm:px-10 sm:pt-10 sm:pb-4">
          <div data-flipped={step === "names" ? "" : undefined} className="stage-turn relative w-full max-w-[27rem]">
            <div className="stage-face stage-fit relative" inert={step === "names"}>
              <InkProvider key={take} salt={take || undefined} draw="mount">
                <LaunchCard count={count} done={done} onDone={setDone} shipped={shipped} onShip={ship} start={take ? 560 : 120} />
              </InkProvider>
            </div>
            <div className="stage-face stage-back absolute inset-0" inert={step !== "names"}>
              {code}
            </div>
          </div>
        </div>
        <Caption step={step} take={take} theme={theme} night={night} />
        <WritingPen size={58} take={take} rest={rest} />
      </div>
    </div>
  );
}

/** A line under the card about what the step is doing to it, written in as the step changes. */
function Caption({ step, take, theme, night }: { step: string; take: number; theme: StageTheme; night: boolean }) {
  const width = useCardWidth(step === "fit");
  const mode = night ? "dark" : "light";
  const ratio = useMemo(
    () => contrast(parseColor(pens[theme.pen].ink[mode]), parseColor(papers[theme.paper].paper[mode])),
    [theme.pen, theme.paper, mode],
  );
  const text =
    step === "names"
      ? "Turned over: the code that draws it."
      : step === "strokes"
        ? `Drawn again from seed ${(hashSeed(`stage:${take}`) % 9000) + 1000}.`
        : step === "fit"
          ? `${width}px wide, every line redrawn.`
          : step === "pens"
            ? `${pens[theme.pen].title} on ${papers[theme.paper].title.toLowerCase()}${night ? " at night" : ""}, ${ratio.toFixed(1)}:1 contrast.`
            : "Tick the last one off, then ship it.";
  return (
    <p className="relative min-h-[3.25rem] pr-24 pb-3 pl-4 text-sm text-ink-3 sm:min-h-[4.25rem] sm:pr-40 sm:pb-7 sm:pl-10 sm:text-base">
      <span key={step} className="ink-write inline-block text-balance" style={{ "--ink-d": "520ms", "--ink-dd": "60ms" } as CSSProperties}>
        {text}
      </span>
    </p>
  );
}

/** The card's width while `on`, as it's squeezed. */
function useCardWidth(on: boolean) {
  const [width, setWidth] = useState(0);
  const frame = useRef(0);
  useEffect(() => {
    const card = document.querySelector<HTMLElement>(".stage-fit");
    if (!on || !card) return;
    const observer = new ResizeObserver(([entry]) => {
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => setWidth(Math.round(entry.contentRect.width)));
    });
    observer.observe(card);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame.current);
    };
  }, [on]);
  return width;
}
