"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { PaperName, PenName } from "@/registry/themes";

/** The front page's story, step by step: what the stage beside it shows. */
export type Step = "hero" | "names" | "strokes" | "fit" | "pens";

export type StageTheme = { pen: PenName; paper: PaperName; night: boolean | null };

/** Blue ballpoint on cream, by day or night as the page is. */
export const defaultTheme: StageTheme = { pen: "blue", paper: "cream", night: null };

type StoryState = {
  step: Step;
  /** How many times the card has been drawn again. */
  take: number;
  redraw: () => void;
  theme: StageTheme;
  /** Set by the story itself, or by the reader (who then keeps it). */
  setTheme: (theme: Partial<StageTheme>, by?: "story" | "reader") => void;
  chosen: boolean;
};

const StoryContext = createContext<StoryState | null>(null);

export function useStory() {
  const story = useContext(StoryContext);
  if (!story) throw new Error("useStory: outside <Story>");
  return story;
}

/**
 * The hero and the steps under it, with the stage that stays in view beside
 * them (below them on a phone). Whichever step crosses the reading line is
 * the one the stage shows: the middle of the screen beside the stage, and
 * lower down under it on a phone, where the stage takes the top.
 */
export function Story({ className, children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<Step>("hero");
  const [take, setTake] = useState(0);
  const [theme, setThemeState] = useState(defaultTheme);
  const [chosen, setChosen] = useState(false);

  const redraw = useCallback(() => setTake((n) => n + 1), []);
  const setTheme = useCallback((next: Partial<StageTheme>, by: "story" | "reader" = "reader") => {
    if (by === "reader") setChosen(true);
    setThemeState((prev) => ({ ...prev, ...next }));
  }, []);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const steps = root.querySelectorAll<HTMLElement>("[data-step]");
    const wide = matchMedia("(min-width: 64rem)");
    let io: IntersectionObserver | undefined;
    const watch = () => {
      io?.disconnect();
      io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) if (entry.isIntersecting) setStep((entry.target as HTMLElement).dataset.step as Step);
        },
        { rootMargin: wide.matches ? "-49% 0px -50% 0px" : "-71% 0px -28% 0px" },
      );
      steps.forEach((el) => io!.observe(el));
    };
    watch();
    wide.addEventListener("change", watch);
    return () => {
      io?.disconnect();
      wide.removeEventListener("change", watch);
    };
  }, []);

  return (
    <StoryContext value={{ step, take, redraw, theme, setTheme, chosen }}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </StoryContext>
  );
}

/** One step of the story, for the stage to show when it crosses the reading line. */
export function StoryStep({ id, className, children }: { id: Exclude<Step, "hero">; className?: string; children: ReactNode }) {
  return (
    <section data-step={id} aria-labelledby={id} className={cn("story-step", className)}>
      {children}
    </section>
  );
}
