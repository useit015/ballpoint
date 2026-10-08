"use client";

import type { CSSProperties, ReactNode } from "react";
import { Annotate } from "@/registry/ballpoint/ui/annotate";
import { Badge } from "@/registry/ballpoint/ui/badge";
import { Button } from "@/registry/ballpoint/ui/button";
import { Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle } from "@/registry/ballpoint/ui/card";
import { Checklist, ChecklistItem } from "@/registry/ballpoint/ui/checklist";
import { Label } from "@/registry/ballpoint/ui/label";
import { Progress, ProgressLabel } from "@/registry/ballpoint/ui/progress";
import { Scrawl } from "@/registry/ballpoint/ui/scrawl";
import { Switch } from "@/registry/ballpoint/ui/switch";

type Beat = { at: number; d: number };

/** The card's list: what's left before launch. */
export const tasks = (count: number) => [
  { value: "draw", label: `Draw ${count} components` },
  { value: "pens", label: "Test every pen" },
  { value: "tell", label: "Tell people" },
];

export const startDone = ["draw", "pens"];

/**
 * The pen's timetable for the card, from `start` ms: the box first, then
 * down the card, each word written about as fast as a hand writes it and
 * each control drawn as the pen reaches it.
 */
function timetable(start: number, labels: string[]) {
  let t = start;
  const word = (text: string): Beat => {
    const beat = { at: t, d: 50 + text.length * 17 };
    t += beat.d * 0.74 + 20;
    return beat;
  };
  const drawn = (takes: number): Beat => {
    const beat = { at: t, d: takes };
    t += takes;
    return beat;
  };
  return {
    card: drawn(640),
    title: word("Launch day"),
    badge: drawn(220),
    progress: drawn(320),
    items: labels.map((label) => ({ box: drawn(150), label: word(label) })),
    remind: drawn(200),
    remindLabel: word("Remind the team"),
    ship: drawn(200),
    later: drawn(180),
  };
}

/**
 * Words written in by the pen at their beat. `inside` words belong to a
 * control the pen is already drawing at that beat (a badge's, a button's),
 * so the pen doesn't make a separate trip to them.
 */
function W({ beat, inside = false, children }: { beat: Beat; inside?: boolean; children: ReactNode }) {
  return (
    <span
      className="ink-write inline-block"
      data-pen-at={inside ? undefined : beat.at}
      data-pen-d={inside ? undefined : beat.d}
      style={{ "--ink-d": `${beat.d}ms`, "--ink-dd": `${beat.at}ms` } as CSSProperties}
    >
      {children}
    </span>
  );
}

/** A control drawn at its beat (.pen-at in globals.css); `box` names the part the pen goes round. */
function At({ beat, box, className, children }: { beat: Beat; box?: string; className?: string; children: ReactNode }) {
  return (
    <span
      className={`pen-at ${className ?? "inline-flex"}`}
      data-pen-at={beat.at}
      data-pen-d={beat.d}
      data-pen-box={box}
      style={{ "--pen-at": `${beat.at}ms` } as CSSProperties}
    >
      {children}
    </span>
  );
}

/**
 * The front page's card: a launch-day list built from the registry's own
 * components, drawn by the pen in the order a hand would. Ticking the list
 * fills the progress; shipping ticks the rest and stamps it.
 */
export function LaunchCard({
  count,
  done,
  onDone,
  shipped,
  onShip,
  start = 120,
}: {
  count: number;
  done: string[];
  onDone: (done: string[]) => void;
  shipped: boolean;
  onShip: (shipped: boolean) => void;
  /** ms before the pen starts on the box. */
  start?: number;
}) {
  const list = tasks(count);
  const beats = timetable(start, list.map((task) => task.label));

  return (
    <div
      className="pen-at stage-card relative w-full"
      data-pen-at={beats.card.at}
      data-pen-d={beats.card.d}
      style={{ "--pen-at": `${beats.card.at}ms` } as CSSProperties}
    >
      <Card seed="stage-card" className="[--card-spacing:--spacing(4)] sm:[--card-spacing:--spacing(6)]">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">
            <W beat={beats.title}>Launch day</W>
          </CardTitle>
          <CardAction>
            <At beat={beats.badge}>
              <Badge variant="outline" seed="stage-badge">
                <W beat={beats.badge} inside>
                  Friday
                </W>
              </Badge>
            </At>
          </CardAction>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:gap-5">
          <At beat={beats.progress} box="[data-slot=progress-track]" className="block">
            <Progress value={(done.length / list.length) * 100} seed="stage-progress">
              <ProgressLabel className="text-ink-2">
                {done.length} of {list.length} done
              </ProgressLabel>
            </Progress>
          </At>
          <Checklist value={done} onValueChange={onDone} aria-label="Launch day" className="gap-1.5 sm:gap-2.5">
            {list.map((task, i) => (
              <At key={task.value} beat={beats.items[i].box} box="[data-slot=checkbox]" className="flex">
                <ChecklistItem value={task.value} seed={`stage-${task.value}`}>
                  <W beat={beats.items[i].label}>{task.label}</W>
                </ChecklistItem>
              </At>
            ))}
          </Checklist>
          <At beat={beats.remind} box="[data-slot=switch]" className="flex">
            <Label>
              <Switch defaultChecked seed="stage-remind" />
              <W beat={beats.remindLabel}>Remind the team</W>
            </Label>
          </At>
        </CardContent>
        <CardFooter>
          <At beat={beats.ship}>
            <Button seed="stage-ship" onClick={() => onShip(true)}>
              {shipped ? "Shipped" : "Ship it"}
            </Button>
          </At>
          <At beat={beats.later}>
            <Button variant="ghost" seed="stage-later" onClick={() => onShip(false)}>
              <W beat={beats.later} inside>
                {shipped ? "Undo" : "Not yet"}
              </W>
            </Button>
          </At>
        </CardFooter>
      </Card>
      {/* Shipped: stamped in red pen across the corner, with a star for luck. */}
      {shipped && (
        <div aria-hidden="true" className="stage-stamp pointer-events-none absolute right-5 bottom-[4.2rem] -rotate-[9deg] text-3xl font-bold text-pen-red sm:right-7">
          <Annotate type="circle" color="red" draw="mount" seed="stage-stamp">
            <span className="ink-write inline-block px-1" style={{ "--ink-d": "420ms", "--ink-dd": "80ms" } as CSSProperties}>
              Shipped!
            </span>
          </Annotate>
          <Scrawl kind="star" draw="mount" delay={520} seed="stage-star" className="absolute -top-8 -right-7" />
        </div>
      )}
    </div>
  );
}
