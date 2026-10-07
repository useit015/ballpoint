"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Switch } from "@/registry/ballpoint/ui/switch";
import { setNight, useNight } from "@/components/landing/night";
import { PenArrow } from "@/components/landing/pen-arrow";
import { useRedraw } from "@/components/landing/redraw";

type Beat = { at: number; d: number };

/**
 * The pen's timetable for the front page's sentence: words are written one
 * after another, about as fast as a hand writes them, and each control is
 * drawn as the pen reaches it. Plain CSS from the first paint: nothing waits
 * for scripts.
 */
function timetable() {
  let t = 120;
  const word = (text: string): Beat => {
    const beat = { at: t, d: 60 + text.length * 21 };
    t += beat.d * 0.74 + 24;
    return beat;
  };
  const drawn = (takes: number) => {
    const at = t;
    t += takes;
    return at;
  };
  return {
    components: word("Components"),
    you: word("you"),
    can: word("can"),
    press: drawn(250),
    pressLabel: word("press"),
    comma: word(","),
    tick: drawn(190),
    tickWord: word("tick"),
    and: word("and"),
    flip: drawn(210),
    flipWord: word("flip,"),
    drawn: word("drawn"),
    in: word("in"),
    blue: word("blue"),
    ballpoint: word("ballpoint."),
    end: t,
  };
}

const beats = timetable();
/** When the pen lifts off the sentence, for whatever follows it. */
export const heroWritten = beats.end;

/** A word written in by the pen at its beat. */
function W({ beat, children }: { beat: Beat; children: ReactNode }) {
  return (
    <span className="ink-write inline-block" style={{ "--ink-d": `${beat.d}ms`, "--ink-dd": `${beat.at}ms` } as CSSProperties}>
      {children}
    </span>
  );
}

/** A control drawn at its beat (see .pen-at in globals.css), scaled to the words around it. */
function At({ at, className, children }: { at: number; className: string; children: ReactNode }) {
  return (
    <span className={`pen-at ${className}`} style={{ "--pen-at": `${at}ms` } as CSSProperties}>
      {children}
    </span>
  );
}

/**
 * "Components you can press, tick and flip, drawn in blue ballpoint", with
 * the button, the checkbox and the switch in the sentence, working: press
 * redraws the page in a fresh hand, tick ticks, and flip turns the page to
 * night.
 */
export function HeroLine() {
  const { salt, redraw } = useRedraw();
  const night = useNight();
  const press = useRef<HTMLButtonElement>(null);
  const flip = useRef<HTMLSpanElement>(null);

  // Pressing remounts the page; keep the keyboard where it was.
  useEffect(() => {
    if (salt) press.current?.focus({ preventScroll: true });
  }, [salt]);

  return (
    <p className="hero-line relative font-bold text-balance text-ink">
      <W beat={beats.components}>Components</W> <W beat={beats.you}>you</W> <W beat={beats.can}>can</W> <br className="max-lg:hidden" />
      <span className="whitespace-nowrap">
        <At at={beats.press} className="hero-press">
          <Button ref={press} size="lg" draw="mount" seed="hero-press" onClick={redraw} aria-label="Press: redraw the page in a fresh hand">
            <W beat={beats.pressLabel}>press</W>
          </Button>
        </At>
        <W beat={beats.comma}>,</W>
      </span>{" "}
      <span className="whitespace-nowrap">
        <At at={beats.tick} className="hero-tick">
          <Checkbox draw="mount" seed="hero-tick" aria-label="Tick" />
        </At>{" "}
        <W beat={beats.tickWord}>tick</W>
      </span>{" "}
      <W beat={beats.and}>and</W>{" "}
      <span className="whitespace-nowrap">
        <At at={beats.flip} className="hero-flip">
          <span ref={flip} className="inline-flex">
            <Switch
              draw="mount"
              seed="hero-flip"
              checked={night}
              onCheckedChange={(on) => flip.current && void setNight(on, flip.current)}
              aria-label="Flip: night"
            />
          </span>
        </At>{" "}
        <W beat={beats.flipWord}>flip,</W>
      </span>{" "}
      <br className="max-lg:hidden" />
      <W beat={beats.drawn}>drawn</W> <W beat={beats.in}>in</W> <W beat={beats.blue}>blue</W>{" "}
      <W beat={beats.ballpoint}>ballpoint.</W>
      {/* An aside in the margin, once the sentence is down. */}
      <span aria-hidden="true" className="absolute top-[1.3em] right-0 hidden w-52 -rotate-3 text-xl leading-snug font-normal tracking-normal text-ink-3 [word-spacing:normal] xl:block">
        <W beat={{ at: beats.end + 350, d: 700 }}>they work, by the way</W>
        <PenArrow seed="hero-aside" from={[186, 18]} to={[22, 78]} size={[200, 92]} bend={-0.45} delay={beats.end + 900} className="top-5 -left-48" />
      </span>
    </p>
  );
}
