"use client";

import { useEffect, useRef, useState } from "react";
import { PenArt } from "@/components/art/pen-art";
import { written } from "@/components/home/write";
import { arrow } from "@/lib/art/doodles";
import { aim, type Rect } from "@/lib/art/callout";
import type { Scene } from "@/lib/art/kit";
import { cn } from "@/lib/utils";

type Arrow = Scene & { origin: readonly [number, number] };

/**
 * A handwritten note about something else on the page, with an arrow drawn
 * from it to that thing. The arrow is aimed by measuring where the note and
 * its target actually are, so it still lands when the layout moves: at
 * another width, when the fonts arrive, when the page reflows. Place the
 * note with CSS, wherever there is room; give it the id of what it is about.
 * Each entry of `lines` is one line, never wrapped.
 */
export function Callout({
  lines,
  target,
  at,
  bend = 0.25,
  seed,
  delay = 0,
  run = false,
  className,
}: {
  lines: string[];
  /** The id of the element the note is about. */
  target: string;
  /** Where on it, as fractions across and down; by default the point nearest the note. */
  at?: readonly [number, number];
  /** How far the arrow bows to one side, as a fraction of its length (the sign picks the side). */
  bend?: number;
  seed: string;
  /** ms before the words are written; the arrow follows them. */
  delay?: number;
  /** Draw as soon as it is made, instead of when it scrolls into view. */
  run?: boolean;
  className?: string;
}) {
  const note = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<Arrow | null>(null);
  const writing = lines.reduce((n, l) => n + l.split(" ").length, 0) * 150;
  const key = at ? at.join(",") : "";

  useEffect(() => {
    const el = note.current;
    if (!el) return;
    let frame = 0;
    let last = "";
    const measure = () => {
      frame = 0;
      const goal = document.getElementById(target);
      if (!goal) return;
      const n = el.getBoundingClientRect();
      const t = goal.getBoundingClientRect();
      // Hidden at this width: nothing to point from.
      if (!n.width || !t.width) {
        last = "none";
        return setScene(null);
      }
      const rect = (r: DOMRect): Rect => ({ left: r.left, top: r.top, width: r.width, height: r.height });
      const line = aim(rect(n), rect(t), { at: key ? (key.split(",").map(Number) as [number, number]) : undefined });
      // To the nearest two px, so a resize in progress doesn't redraw the arrow at every step.
      const snap = (v: number) => Math.round(v / 2) * 2;
      const id = line ? [...line.from, ...line.to].map(snap).join(",") : "none";
      if (id === last) return;
      last = id;
      if (!line) return setScene(null);
      setScene(arrow(seed, [snap(line.from[0]), snap(line.from[1])], [snap(line.to[0]), snap(line.to[1])], bend, delay + writing));
    };
    const soon = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    soon();
    const watch = new ResizeObserver(soon);
    watch.observe(el);
    watch.observe(document.body);
    const goal = document.getElementById(target);
    if (goal) watch.observe(goal);
    document.fonts?.ready.then(soon);
    addEventListener("resize", soon);
    return () => {
      cancelAnimationFrame(frame);
      watch.disconnect();
      removeEventListener("resize", soon);
    };
  }, [target, key, seed, bend, delay, writing]);

  // Where each line starts: after the words of the lines before it.
  const starts = lines.map((_, i) => delay + lines.slice(0, i).reduce((n, l) => n + l.split(" ").length * 150, 0));
  return (
    <div ref={note} className={cn("callout", className)}>
      <p className="callout-text">
        {lines.map((line, i) => (
          <span key={i} className="callout-line">
            {written(line, starts[i])}
          </span>
        ))}
      </p>
      {scene && <PenArt scene={scene} scale={1} view={!run} className="callout-arrow" style={{ left: scene.origin[0], top: scene.origin[1] }} />}
    </div>
  );
}
