"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { Stroke } from "@/registry/ballpoint/lib/ink";
import { createRng, hashSeed, inkRibbon, lineStroke, loopStroke, penBoxStrokes, shadeFill } from "@/registry/ballpoint/lib/ink-sketch";
import { Avatar, AvatarFallback } from "@/registry/ballpoint/ui/avatar";
import { Button } from "@/registry/ballpoint/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/registry/ballpoint/ui/card";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Input } from "@/registry/ballpoint/ui/input";
import { Slider } from "@/registry/ballpoint/ui/slider";
import { Switch } from "@/registry/ballpoint/ui/switch";
import { written } from "@/components/landing/guide";
import { Pen } from "@/components/landing/pen";
import { recognize, type Point, type Shape } from "@/components/landing/recognize";

// ─── The sheet you can write on ─────────────────────────────────────────
// Anything drawn on the front page's sheet is read (recognize.ts) and
// becomes what it was meant to be: a word circled, boxed, underlined,
// struck or scribbled out is marked up the way Annotate and Redact mark
// it, and a shape drawn on blank paper is drawn again as the component it
// looks like, with its code written beside it. Everything else stays as
// ink. What's drawn belongs to the part of the page it's in, and moves
// with it when the page reflows.

type Rect = { x: number; y: number; w: number; h: number };
type Ink = { x: number; y: number; w: number };
type MarkType = "circle" | "box" | "underline" | "strike" | "redact";
type ThingType = "button" | "input" | "card" | "checkbox" | "tick" | "avatar" | "switch" | "slider";
/** Where a label sits, from the top left corner of what it names; null where there's no room for it. */
type Spot = { dx: number; dy: number } | null;

type Item = { id: number; part: number; stroke: number; leaving?: boolean } & (
  | { type: "ink"; d: string; fading: boolean }
  | { type: "mark"; mark: MarkType; ranges: Range[]; rect: Rect; spot: Spot }
  | {
      type: "thing";
      thing: ThingType;
      rect: Rect;
      spot: Spot;
      text: string;
      size: ButtonSize;
      scale: number;
    }
);
type ButtonSize = "sm" | "default" | "lg";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const area = (r: Rect) => r.w * r.h;
const overlap = (a: Rect, b: Rect) =>
  Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
const grow = (r: Rect, x: number, y = x): Rect => ({
  x: r.x - x,
  y: r.y - y,
  w: r.w + 2 * x,
  h: r.h + 2 * y,
});
function union(rects: Rect[]): Rect {
  const x = Math.min(...rects.map((r) => r.x));
  const y = Math.min(...rects.map((r) => r.y));
  return {
    x,
    y,
    w: Math.max(...rects.map((r) => r.x + r.w)) - x,
    h: Math.max(...rects.map((r) => r.y + r.h)) - y,
  };
}

// Where a pointer goes down to draw: not on anything that does something
// itself, nor on the code (people copy it), nor on what's already drawn.
const KEEP_OFF =
  "a, button, input, textarea, select, label, [role=radio], [role=radiogroup], [role=checkbox], [role=switch], [role=slider], [data-slot=slider], [data-slot=signature-pad], [data-slot=checklist], .slip, pre, code, [data-ink-scope], [data-sketch-item]";
// Text that isn't on the page to be marked up.
const NOT_TEXT = `${KEEP_OFF}, [aria-hidden=true], .sr-only`;
// What a shape drawn on blank paper mustn't land on.
const TAKEN = "a, button, input, textarea, [role], [data-slot=checklist], [data-slot=signature-pad], [data-slot=section-heading], .slip, [data-ink-scope]";

/** The code each mark and thing would be written as. */
const markCode: Record<MarkType, string> = {
  circle: '<Annotate type="circle">',
  box: '<Annotate type="box">',
  underline: '<Annotate type="underline">',
  strike: '<Annotate type="strike">',
  redact: "<Redact>",
};
const thingCode: Record<ThingType, (text: string) => string> = {
  button: (text) => `<Button>${text}</Button>`,
  input: () => "<Input />",
  card: () => "<Card>",
  checkbox: () => "<Checkbox />",
  tick: () => "<Checkbox defaultChecked />",
  avatar: () => "<Avatar />",
  switch: () => "<Switch />",
  slider: () => "<Slider />",
};
const said: Record<ThingType | MarkType, string> = {
  button: "a button",
  input: "an input",
  card: "a card",
  checkbox: "a checkbox",
  tick: "a ticked checkbox",
  avatar: "an avatar",
  switch: "a switch",
  slider: "a slider",
  circle: "a circle round the words",
  box: "a box round the words",
  underline: "a line under the words",
  strike: "a line through the words",
  redact: "the words scribbled out",
};
const buttonWords = ["Ship it", "Save", "Send", "Sign up", "Next", "Done"];

/** The component a shape drawn on blank paper looks like. */
function thingFor(shape: Shape): ThingType | null {
  const { w, h } = shape.box;
  switch (shape.kind) {
    case "box":
      if (w < 48 && h < 48) return "checkbox";
      if (w / h >= 4.2 && h < 72) return "input";
      if (h >= 110 && w >= 150) return "card";
      return "button";
    case "loop":
      return w / h >= 1.7 && h <= 80 ? "switch" : "avatar";
    case "line":
      return "slider";
    case "check":
      return "tick";
    default:
      return null;
  }
}

/** Where the component sits on the shape drawn for it, and how big it's drawn. */
function fit(thing: ThingType, b: Rect): { rect: Rect; size: ButtonSize; scale: number } {
  const cx = b.x + b.w / 2;
  const cy = b.y + b.h / 2;
  const at = (w: number, h: number, scale = 1, size: ButtonSize = "default") => ({ rect: { x: cx - w / 2, y: cy - h / 2, w, h }, size, scale });
  switch (thing) {
    case "button": {
      const size: ButtonSize = b.h < 36 ? "sm" : b.h < 50 ? "default" : "lg";
      return at(clamp(b.w, 88, 360), { sm: 32, default: 40, lg: 48 }[size], 1, size);
    }
    case "input":
      return at(clamp(b.w, 140, 440), 40);
    case "card":
      return at(clamp(b.w, 200, 440), clamp(b.h, 128, 320));
    case "checkbox": {
      const s = clamp(Math.min(b.w, b.h) / 22, 1, 2);
      return at(20 * s, 20 * s, s);
    }
    case "tick": {
      const s = clamp(b.h / 26, 1, 2);
      return at(20 * s, 20 * s, s);
    }
    case "avatar": {
      const s = clamp(Math.min(b.w, b.h), 40, 112) / 40;
      return at(40 * s, 40 * s, s);
    }
    case "switch": {
      const s = clamp(b.w / 48, 1, 1.8);
      return at(44 * s, 24 * s, s);
    }
    case "slider":
      return at(clamp(b.w, 120, 520), 36);
  }
}

/** How far a mark's ink reaches past the words it's drawn round. */
function inkRect(mark: MarkType, r: Rect): Rect {
  switch (mark) {
    case "circle":
      return grow(r, Math.max(9, r.w * 0.07) + 3, (r.h < 40 ? Math.max(5, r.h * 0.26) : 4 + r.h * 0.06) + 4);
    case "box":
      return grow(r, 9, 6);
    case "underline":
      return { ...grow(r, 6, 0), h: r.h + 6 };
    default:
      return grow(r, 4, 0);
  }
}

// ─── Reading the page ──────────────────────────────────────────────────

type Word = { range: Range; rect: Rect };
const WORD = /[\p{L}\p{N}][\p{L}\p{N}'’/.-]*[\p{L}\p{N}]|[\p{L}\p{N}]/gu;

function textNodes(within: Element) {
  const walker = document.createTreeWalker(within, NodeFilter.SHOW_TEXT, {
    acceptNode: (n) => (!n.textContent?.trim() || n.parentElement?.closest(NOT_TEXT) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT),
  });
  const out: Text[] = [];
  while (walker.nextNode()) out.push(walker.currentNode as Text);
  return out;
}

const relTo = (r: DOMRect, o: { x: number; y: number }): Rect => ({
  x: r.left - o.x,
  y: r.top - o.y,
  w: r.width,
  h: r.height,
});

/** Every word in a part, where it is relative to `o` (the part's corner, in the viewport). */
function wordsIn(part: Element, o: { x: number; y: number }): Word[] {
  const words: Word[] = [];
  for (const node of textNodes(part)) {
    for (const m of node.data.matchAll(WORD)) {
      const range = document.createRange();
      range.setStart(node, m.index);
      range.setEnd(node, m.index + m[0].length);
      const r = range.getBoundingClientRect();
      if (r.width > 0) words.push({ range, rect: relTo(r, o) });
    }
  }
  return words;
}

/** Everything already on a part that a new thing or a label mustn't cover. */
function takenIn(part: Element, o: { x: number; y: number }): Rect[] {
  const rects: Rect[] = [];
  for (const node of textNodes(part)) {
    const range = document.createRange();
    range.selectNodeContents(node);
    for (const r of range.getClientRects()) if (r.width > 0) rects.push(relTo(r, o));
  }
  for (const el of part.querySelectorAll(TAKEN)) {
    const r = el.getBoundingClientRect();
    if (r.width > 0) rects.push(relTo(r, o));
  }
  return rects;
}

const CHAR = 7.9;
const labelSize = (text: string) => ({ w: text.length * CHAR + 6, h: 20 });
const labelOf = (r: Rect, spot: Spot, text: string): Rect | null => (spot ? { x: r.x + spot.dx, y: r.y + spot.dy, ...labelSize(text) } : null);

/**
 * Where a label (`text`, in the code hand) goes beside `r`: above it,
 * after it, below it or above its end, slid along past anything it would
 * cover, whichever has to move least; or nowhere, when there's no room.
 */
function spotFor(r: Rect, text: string, taken: Rect[], width: number): Spot {
  const { w, h } = labelSize(text);
  const starts = [
    { x: r.x, y: r.y - h - 4 },
    { x: r.x + r.w + 12, y: r.y + r.h / 2 - h / 2 },
    { x: r.x, y: r.y + r.h + 6 },
    { x: r.x + r.w - w, y: r.y - h - 4 },
  ];
  const covered = (at: Rect) => taken.reduce((sum, t) => sum + overlap(t, at), 0);
  let best: Spot = null;
  let least = Infinity;
  starts.forEach((s, order) => {
    const at = { x: clamp(s.x, 0, width - w), y: s.y, w, h };
    for (let k = 0; k < 8; k++) {
      const hits = taken.filter((t) => overlap(t, at) > 0);
      if (!hits.length) break;
      at.x = Math.max(...hits.map((t) => t.x + t.w)) + 10;
    }
    if (at.x + w > width || covered(at) > 0) return;
    const moved = Math.abs(at.x - s.x) + order * 6;
    if (moved < least) [best, least] = [{ dx: at.x - r.x, dy: at.y - r.y }, moved];
  });
  return best;
}

/**
 * Squares a thing up with the ruled lines it was drawn across: centred on
 * a line or between two (a card's top on a line), whichever is nearest.
 */
function onRules(part: Element, r: Rect, top = false) {
  const css = getComputedStyle(part);
  const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
  const px = (v: string) => (v.trim().endsWith("rem") ? parseFloat(v) * rem : parseFloat(v));
  const rule = px(css.getPropertyValue("--paper-rule"));
  const first = px(css.getPropertyValue("--rule-at")) - 1;
  if (!(rule > 0) || Number.isNaN(first)) return r.y;
  if (top) return first + Math.round((r.y - first) / rule) * rule;
  const step = rule / 2;
  return first + Math.round((r.y + r.h / 2 - first) / step) * step - r.h / 2;
}

// ─── The hand ──────────────────────────────────────────────────────────

/**
 * A ballpoint following a hand: it trails the pointer a beat (smoothing a
 * mouse's jitter) and lays a thinner line the faster it moves, the way
 * Signature Pad's does; a stylus presses it wider.
 */
class Hand {
  x = 0;
  y = 0;
  t = 0;
  v = 0;
  points: Point[] = [];
  ink: Ink[] = [];
  start(x: number, y: number, t: number, pressure = 0) {
    Object.assign(this, { x, y, t, v: 0 });
    this.points = [{ x, y }];
    this.ink = [{ x, y, w: pressure > 0 ? 2 * (0.5 + pressure) : 2.4 }];
  }
  move(px: number, py: number, t: number, pressure = 0) {
    const dt = Math.max(t - this.t, 1);
    const x = this.x + (px - this.x) * 0.55;
    const y = this.y + (py - this.y) * 0.55;
    const d = Math.hypot(x - this.x, y - this.y);
    if (d < 0.8) return;
    this.v = this.v * 0.7 + (d / dt) * 0.3;
    Object.assign(this, { x, y, t });
    let w = clamp(2.3 - this.v * 0.38, 1.1, 2.3);
    if (pressure > 0) w *= 0.5 + pressure;
    const last = this.ink[this.ink.length - 1];
    this.points.push({ x: px, y: py });
    this.ink.push({ x, y, w: last.w * 0.65 + w * 0.35 });
  }
  /** Lifting off: the line flicks off thin if the hand was still moving. */
  end() {
    const last = this.ink[this.ink.length - 1];
    if (this.ink.length > 1) this.ink.push({ ...last, w: last.w * (this.v > 0.9 ? 0.4 : 0.85) });
    return { points: this.points, ink: this.ink };
  }
}

// ─── The pen putting itself to the page ───────────────────────────────

type Timed = Point & { t: number };
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** A box pulled round in one go, the corners a little loose, closed past where it began. */
function boxPath(seed: number, r: Rect): Timed[] {
  const rng = createRng(seed);
  const j = (k: number) => (rng() - 0.5) * 2 * k;
  const c: Point[] = [
    { x: r.x + j(2), y: r.y + j(2) },
    { x: r.x + r.w + j(3), y: r.y + j(3) },
    { x: r.x + r.w + j(3), y: r.y + r.h + j(3) },
    { x: r.x + j(3), y: r.y + r.h + j(3) },
    { x: r.x + j(2) + 2, y: r.y - 6 },
  ];
  const out: Timed[] = [];
  let t = 0;
  for (let i = 0; i < 4; i++) {
    const [a, b] = [c[i], c[i + 1]];
    const len = Math.hypot(b.x - a.x, b.y - a.y);
    const dur = 70 + len * 1.25;
    const n = Math.max(6, Math.round(len / 5));
    const bow = j(Math.min(4, len * 0.02));
    for (let k = i ? 1 : 0; k <= n; k++) {
      const u = k / n;
      const e = easeInOut(u);
      const nx = -(b.y - a.y) / len;
      const ny = (b.x - a.x) / len;
      const off = Math.sin(u * Math.PI) * bow;
      out.push({
        x: a.x + (b.x - a.x) * e + nx * off,
        y: a.y + (b.y - a.y) * e + ny * off,
        t: t + u * dur,
      });
    }
    t += dur + 25;
  }
  return out;
}

/** A loop round a word, started up and to the left, gone round a little more than once. */
function loopPath(seed: number, r: Rect): Timed[] {
  const rng = createRng(seed);
  const cx = r.x + r.w / 2;
  const cy = r.y + r.h / 2;
  const rx = r.w / 2 + Math.max(14, r.w * 0.08);
  const ry = r.h / 2 + Math.max(8, r.h * 0.16);
  const start = -Math.PI * (0.78 + rng() * 0.08);
  const sweep = Math.PI * 2 * 1.1;
  const dur = 620 + r.w * 0.5;
  const n = 64;
  return Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    const a = start + easeInOut(u) * sweep;
    const k = 1 + 0.05 * Math.sin(a * 2 + 1) - u * 0.06;
    return {
      x: cx + Math.cos(a) * rx * k,
      y: cy + Math.sin(a) * ry * k,
      t: u * dur,
    };
  });
}

// ─── Marks and things ──────────────────────────────────────────────────

type MarkStroke = {
  d: string;
  width: number;
  opacity: number;
  duration: number;
  at: number;
  x?: number;
  y?: number;
};

/** A mark drawn round w×h of words, in Annotate's hand, its line heavier round bigger type. */
function markStrokes(mark: MarkType, s: number, w: number, h: number): MarkStroke[] {
  const k = clamp(h / 28, 1, 2.4);
  switch (mark) {
    case "circle": {
      // Round big type the loop keeps closer: its line box already stands well off the letters.
      const px = Math.max(9, w * 0.07);
      const py = h < 40 ? Math.max(5, h * 0.26) : 4 + h * 0.06;
      return [
        {
          d: loopStroke(s, w + 2 * (px - py), h, { pad: py, turns: 1.14 }),
          width: 1.5 * k,
          opacity: 1,
          duration: 640,
          at: 0,
          x: -(px - py),
        },
      ];
    }
    case "box":
      return penBoxStrokes(s, w + 10, h + 4, {
        passes: 2,
        corners: "crossed",
      }).map((d, i) => ({
        d,
        width: [1.4, 1.05][i] * k,
        opacity: [1, 0.75][i],
        duration: [460, 380][i],
        at: i * 300,
        x: -5,
        y: -2,
      }));
    case "underline":
      return [0, 1].map((i) => ({
        d: lineStroke(s + i, [-3 + i * 3, h - 1 + i * 2.2 * k], [w + 3 - i * 6, h - 2 + i * 1.6 * k], { overshoot: 2 }),
        width: (i ? 1.1 : 1.6) * k,
        opacity: i ? 0.7 : 1,
        duration: i ? 300 : 460,
        at: i * 380,
      }));
    case "strike":
      return [
        {
          d: lineStroke(s, [-4, h * 0.56], [w + 4, h * 0.5], {
            bow: 0.6,
            overshoot: 1.5,
          }),
          width: 1.6 * k,
          opacity: 1,
          duration: 320,
          at: 0,
        },
      ];
    case "redact": {
      const r = createRng(s);
      return [
        {
          d: shadeFill(s, w + 2, h * 0.62, {
            gap: 1.8,
            angle: -2 + (r() - 0.5) * 2,
            overrun: 1.5,
          }),
          width: 2 * k,
          opacity: 1,
          duration: Math.min(700, 260 + w * 3),
          at: 0,
          x: -1,
          y: h * 0.2,
        },
        {
          d: shadeFill(s + 1, w + 2, h * 0.5, {
            gap: 2.4,
            angle: 3 + (r() - 0.5) * 2,
            overrun: 1,
          }),
          width: 1.6 * k,
          opacity: 0.85,
          duration: Math.min(600, 220 + w * 2.4),
          at: 80,
          x: -1,
          y: h * 0.26,
        },
      ];
    }
  }
}

function MarkInk({ id, mark, rect, at }: { id: number; mark: MarkType; rect: Rect; at: Point }) {
  const strokes = useMemo(() => markStrokes(mark, hashSeed(`sketch-${id}`), rect.w, rect.h), [id, mark, rect.w, rect.h]);
  return (
    <g transform={`translate(${at.x + rect.x} ${at.y + rect.y})`}>
      {strokes.map((m, i) => (
        <g key={i} transform={m.x || m.y ? `translate(${m.x ?? 0} ${m.y ?? 0})` : undefined}>
          <Stroke d={m.d} draw="mount" delay={m.at} duration={m.duration} width={m.width} opacity={m.opacity} />
        </g>
      ))}
    </g>
  );
}

/** Words scribbled out: pressed, the scribble pulls back off them, as Redact's does. */
function Scribbled({ id, rect, at, leaving }: { id: number; rect: Rect; at: Point; leaving?: boolean }) {
  const [hidden, setHidden] = useState(false);
  const strokes = useMemo(() => markStrokes("redact", hashSeed(`sketch-${id}`), rect.w, rect.h), [id, rect.w, rect.h]);
  // Scribbled over a moment after it's put down, so the pen is seen doing it.
  useEffect(() => {
    const t = setTimeout(() => setHidden(true), 40);
    return () => clearTimeout(t);
  }, []);
  return (
    <button
      type="button"
      data-sketch-item=""
      data-checked={hidden ? "" : undefined}
      aria-pressed={!hidden}
      className="sketch-scribbled"
      data-leaving={leaving ? "" : undefined}
      style={{
        left: at.x + rect.x - 3,
        top: at.y + rect.y,
        width: rect.w + 6,
        height: rect.h,
      }}
      onClick={() => setHidden(!hidden)}
    >
      <svg aria-hidden="true" className="ink-sketch absolute inset-0 size-full text-ink">
        {strokes.map((m, i) => (
          <g key={i} transform={`translate(${3 + (m.x ?? 0)} ${m.y ?? 0})`}>
            <Stroke d={m.d} draw="checked" delay={m.at} duration={m.duration} width={m.width} opacity={m.opacity} />
          </g>
        ))}
      </svg>
      <span className="sr-only">{hidden ? "Words you scribbled out, press to show" : "Words you scribbled out, press to hide"}</span>
    </button>
  );
}

/** A switch or a checkbox that's put on a beat after it's drawn, the way it was asked for. */
function useSoon(ms: number) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), ms);
    return () => clearTimeout(t);
  }, [ms]);
  return [on, setOn] as const;
}

function Ticked({ seed }: { seed: string }) {
  const [on, setOn] = useSoon(420);
  return <Checkbox draw="mount" seed={seed} checked={on} onCheckedChange={setOn} aria-label="The box you ticked" />;
}

function Flipped({ seed }: { seed: string }) {
  const [on, setOn] = useSoon(700);
  return <Switch draw="mount" seed={seed} checked={on} onCheckedChange={setOn} aria-label="The switch you drew" />;
}

function Thing({ item, at }: { item: Extract<Item, { type: "thing" }>; at: Point }) {
  const seed = `sketch-${item.id}`;
  const { rect, scale } = item;
  const box: CSSProperties = {
    left: at.x + rect.x,
    top: at.y + rect.y,
    width: rect.w,
    height: rect.h,
  };
  const scaled = (child: ReactNode) => (
    <span className="block origin-top-left" style={{ transform: `scale(${scale})` }}>
      {child}
    </span>
  );
  let body: ReactNode;
  switch (item.thing) {
    case "button":
      body = (
        <Button draw="mount" seed={seed} size={item.size} className="w-full">
          {written(item.text, 420)}
        </Button>
      );
      break;
    case "input":
      body = <Input draw="mount" seed={seed} placeholder="Write here" aria-label="The field you drew" className="w-full" />;
      break;
    case "card":
      body = (
        <Card draw="mount" seed={seed} size="sm" className="size-full">
          <CardHeader>
            <CardTitle>{written("You drew this", 500)}</CardTitle>
            <CardDescription>{written("A Card, cut to the size of your box.", 900)}</CardDescription>
          </CardHeader>
        </Card>
      );
      break;
    case "checkbox":
      body = scaled(<Checkbox draw="mount" seed={seed} aria-label="The box you drew" />);
      break;
    case "tick":
      body = scaled(<Ticked seed={seed} />);
      break;
    case "avatar":
      body = scaled(
        <Avatar draw="mount" seed={seed} size="lg">
          <AvatarFallback>You</AvatarFallback>
        </Avatar>,
      );
      break;
    case "switch":
      body = scaled(<Flipped seed={seed} />);
      break;
    case "slider":
      body = <Slider draw="mount" seed={seed} defaultValue={[60]} aria-label="The slider you drew" />;
      break;
  }
  return (
    <div data-sketch-item="" data-leaving={item.leaving ? "" : undefined} className="sketch-thing" style={box}>
      {body}
    </div>
  );
}

function Code({ text, rect, spot, at, leaving }: { text: string; rect: Rect; spot: Spot; at: Point; leaving?: boolean }) {
  if (!spot) return null;
  return (
    <span
      aria-hidden="true"
      className="sketch-code"
      data-leaving={leaving ? "" : undefined}
      style={{ left: at.x + rect.x + spot.dx, top: at.y + rect.y + spot.dy }}
    >
      {written(text, 380)}
    </span>
  );
}

/** A rubber, drawn: a block worn down at one end, and the crumbs it leaves. */
function Rubber() {
  const s = hashSeed("sketch-rubber");
  const d = [
    lineStroke(s, [4, 15], [12, 7], { bow: 0.4, jitter: 0.2 }) +
      lineStroke(s + 1, [12, 7], [20, 13], { bow: 0.4, jitter: 0.2 }).replace(/^M[^C]*/, "L12 7") +
      lineStroke(s + 2, [20, 13], [12, 21], { bow: 0.4, jitter: 0.2 }).replace(/^M[^C]*/, "L20 13") +
      lineStroke(s + 3, [12, 21], [4, 15], { bow: 0.4, jitter: 0.2 }).replace(/^M[^C]*/, "L12 21"),
    lineStroke(s + 4, [8, 11], [16, 17], { bow: 0.3, jitter: 0.2 }),
    lineStroke(s + 5, [2, 22], [6, 22], { bow: 0.2, jitter: 0.2 }),
  ];
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="ink-glyph size-6">
      {d.map((p, i) => (
        <Stroke key={i} d={p} width={i ? 1.2 : 1.6} />
      ))}
    </svg>
  );
}

// ─── The sheet ─────────────────────────────────────────────────────────

const SketchContext = createContext<{
  penUp: boolean;
  setPenUp: (up: boolean) => void;
}>({ penUp: false, setPenUp: () => {} });
export const useSketch = () => useContext(SketchContext);

export function Sketch({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const live = useRef<SVGPathElement>(null);
  const pen = useRef<HTMLSpanElement>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [origins, setOrigins] = useState<(Rect & { under: number })[]>([]);
  const [status, setStatus] = useState("");
  const [penUp, setPenUp] = useState(false);
  const next = useRef(1);
  const strokes = useRef(0);
  const buttons = useRef(0);
  const hand = useRef<Hand | null>(null);
  const drawing = useRef<{ pointer: number; o: Point } | null>(null);
  const frame = useRef(0);
  // The pen's own demonstration, stopped by anyone starting to draw; once
  // someone has (touched), it isn't given at all.
  const demo = useRef<AbortController | null>(null);
  const touched = useRef(false);

  const parts = useCallback(() => [...(root.current?.querySelectorAll<HTMLElement>(".guide-part") ?? [])], []);

  /** Re-measures every part and every marked word, after the page reflows. */
  const measure = useCallback(() => {
    const el = root.current;
    if (!el) return;
    const box = el.getBoundingClientRect();
    const rects = parts().map((p) => ({
      ...relTo(p.getBoundingClientRect(), { x: box.left, y: box.top }),
      // The rubber goes under the part's number.
      under: (p.querySelector(".guide-index")?.getBoundingClientRect().bottom ?? 0) - box.top,
    }));
    setOrigins(rects);
    setItems((all) =>
      all.some((i) => i.type === "mark")
        ? all.map((i) => {
            if (i.type !== "mark") return i;
            const o = rects[i.part];
            const r = union(
              i.ranges.map((range) =>
                relTo(range.getBoundingClientRect(), {
                  x: box.left + o.x,
                  y: box.top + o.y,
                }),
              ),
            );
            return { ...i, rect: r };
          })
        : all,
    );
  }, [parts]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const observer = new ResizeObserver(() => measure());
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

  const say = useCallback((text: string) => setStatus(text), []);

  /** Takes items away, letting them fade first. */
  const rubOut = useCallback((which: (i: Item) => boolean) => {
    setItems((all) => all.map((i) => (which(i) ? { ...i, leaving: true } : i)));
    setTimeout(() => setItems((all) => all.filter((i) => !(i.leaving && which(i)))), 260);
  }, []);

  // What's on the page now, for the handlers (which outlive a render).
  const latest = useRef(items);
  useEffect(() => {
    latest.current = items;
  });

  /** What's been drawn in a part, and where the code beside each is written: a new one keeps clear of them. */
  const drawnIn = useCallback(
    (part: number) =>
      latest.current.flatMap((i) => {
        if (i.part !== part || i.leaving || i.type === "ink") return [];
        const r = i.type === "mark" ? inkRect(i.mark, i.rect) : i.rect;
        const code = i.type === "mark" ? markCode[i.mark] : thingCode[i.thing](i.text);
        return [{ id: i.id, r, code, label: labelOf(r, i.spot, code) }];
      }),
    [],
  );

  /** Reads a finished stroke and puts what it was meant to be on the page. */
  const commit = useCallback(
    (points: Point[], ink: Ink[]) => {
      const el = root.current;
      const shape = recognize(points);
      if (!el || !shape) return;
      const box = el.getBoundingClientRect();
      const sections = parts();
      const cy = shape.box.y + shape.box.h / 2;
      let part = sections.findIndex((p) => {
        const r = p.getBoundingClientRect();
        return cy >= r.top - box.top && cy < r.bottom - box.top;
      });
      if (part < 0) part = cy < 0 ? 0 : sections.length - 1;
      const section = sections[part];
      const pr = section.getBoundingClientRect();
      const o = { x: pr.left - box.left, y: pr.top - box.top };
      const vo = { x: pr.left, y: pr.top };
      const local = (r: Rect): Rect => ({
        x: r.x - o.x,
        y: r.y - o.y,
        w: r.w,
        h: r.h,
      });
      const b = local(shape.box);
      const stroke = ++strokes.current;
      const d = inkRibbon(ink.map((p) => ({ x: p.x - o.x, y: p.y - o.y, w: p.w })));
      const id = () => next.current++;

      const keep = () => setItems((all) => [...all, { id: id(), part, stroke, type: "ink", d, fading: false }]);
      const read = (made: Item) => {
        const sketch = id();
        setItems((all) => [...all, { id: sketch, part, stroke, type: "ink", d, fading: false }, made]);
        // The rough stroke gives way to the clean one.
        requestAnimationFrame(() => setItems((all) => all.map((i) => (i.id === sketch && i.type === "ink" ? { ...i, fading: true } : i))));
        setTimeout(() => setItems((all) => all.filter((i) => i.id !== sketch)), 1100);
      };

      if (shape.kind === "doodle") return keep();
      const taken = takenIn(section, vo);
      const drawn = drawnIn(part);
      const width = box.width - o.x - 8;
      // Code already written where the new one goes is written again somewhere clear.
      const settle = (r: Rect, label: Rect | null) => {
        const moved = new Map<number, Spot>();
        for (const d of drawn) {
          if (!d.label || (!overlap(d.label, r) && !(label && overlap(d.label, label)))) continue;
          const others = drawn.flatMap((e) => (e === d || !e.label ? [e.r] : [e.r, e.label]));
          moved.set(d.id, spotFor(d.r, d.code, [...taken, ...others, r, ...(label ? [label] : [])], width));
        }
        if (moved.size) setItems((all) => all.map((i) => (i.type !== "ink" && moved.has(i.id) ? { ...i, spot: moved.get(i.id)! } : i)));
      };

      // On words: marked up.
      const words = wordsIn(section, vo);
      let marked: { mark: MarkType; words: Word[] } | null = null;
      if (shape.kind === "loop" || shape.kind === "box") {
        const inside = grow(b, 3);
        const hit = words.filter((w) => {
          const [x, y] = [w.rect.x + w.rect.w / 2, w.rect.y + w.rect.h / 2];
          return x >= inside.x && x <= inside.x + inside.w && y >= inside.y && y <= inside.y + inside.h;
        });
        if (hit.length)
          marked = {
            mark: shape.kind === "loop" ? "circle" : "box",
            words: hit,
          };
      } else if (shape.kind === "scribble") {
        const hit = words.filter((w) => overlap(w.rect, b) >= area(w.rect) * 0.4);
        if (hit.length) marked = { mark: "redact", words: hit };
      } else if (shape.kind === "line") {
        const y = shape.points.reduce((s, p) => s + p.y, 0) / shape.points.length - o.y;
        const [x0, x1] = [b.x, b.x + b.w];
        const across = words.filter((w) => Math.min(w.rect.x + w.rect.w, x1) - Math.max(w.rect.x, x0) >= w.rect.w * 0.5);
        const rel = (w: Word) => (y - w.rect.y) / w.rect.h;
        const under = across.filter((w) => rel(w) >= 0.6 && rel(w) <= 1.45);
        const through = across.filter((w) => rel(w) >= 0.22 && rel(w) < 0.6);
        const pick = under.length ? under : through;
        if (pick.length) {
          // One line of text: the one the pen ran along.
          const row = pick.reduce((a, w) => (Math.abs(rel(w) - (under.length ? 1 : 0.45)) < Math.abs(rel(a) - (under.length ? 1 : 0.45)) ? w : a));
          marked = {
            mark: under.length ? "underline" : "strike",
            words: pick.filter((w) => Math.abs(w.rect.y - row.rect.y) < row.rect.h * 0.5),
          };
        }
      }
      if (marked) {
        const rect = union(marked.words.map((w) => w.rect));
        const r = inkRect(marked.mark, rect);
        const spot = spotFor(r, markCode[marked.mark], [...taken, ...drawn.flatMap((d) => (d.label ? [d.r, d.label] : [d.r]))], width);
        settle(r, labelOf(r, spot, markCode[marked.mark]));
        read({
          id: id(),
          part,
          stroke,
          type: "mark",
          mark: marked.mark,
          ranges: marked.words.map((w) => w.range),
          rect,
          spot,
        });
        say(`Drew ${said[marked.mark]}.`);
        return;
      }

      // On blank paper: drawn again as the component it looks like.
      const thing = thingFor(shape);
      if (!thing) return keep();
      // Not over what's printed or drawn here (the code written beside a thing moves out of its way).
      if ([...taken, ...drawn.map((d) => d.r)].some((t) => overlap(t, b) > area(b) * 0.08)) return keep();
      const placed = fit(thing, b);
      const rect = {
        ...placed.rect,
        x: clamp(placed.rect.x, 0, Math.max(0, pr.width - placed.rect.w)),
        y: onRules(section, placed.rect, thing === "card"),
      };
      const text = thing === "button" ? buttonWords[buttons.current++ % buttonWords.length] : "";
      const code = thingCode[thing](text);
      const spot = spotFor(rect, code, [...taken, ...drawn.flatMap((d) => (d.label ? [d.r, d.label] : [d.r])), b], width);
      settle(rect, labelOf(rect, spot, code));
      read({
        id: id(),
        part,
        stroke,
        type: "thing",
        thing,
        rect,
        text,
        size: placed.size,
        scale: placed.scale,
        spot,
      });
      say(`Drew ${said[thing]}.`);
    },
    [parts, say, drawnIn],
  );

  // ─── Drawing with a pointer ───
  const paint = useCallback(() => {
    frame.current = 0;
    live.current?.setAttribute("d", inkRibbon(hand.current?.ink ?? []));
  }, []);
  const schedule = useCallback(() => {
    frame.current ||= requestAnimationFrame(paint);
  }, [paint]);

  function down(e: ReactPointerEvent<HTMLDivElement>) {
    const el = root.current;
    const target = e.target as Element;
    if (!el || drawing.current || e.button !== 0 || target.closest(KEEP_OFF)) return;
    // A mouse draws anywhere on the sheet; a finger only once the pen's been picked up, in the part it was picked up in.
    const fine = e.pointerType === "mouse" || (e.pointerType === "pen" && matchMedia("(hover: hover)").matches);
    if (!fine && !(penUp && target.closest(".guide-hero"))) return;
    e.preventDefault();
    try {
      el.setPointerCapture(e.pointerId);
    } catch {}
    touched.current = true;
    demo.current?.abort();
    const r = el.getBoundingClientRect();
    const o = { x: r.left + scrollX, y: r.top + scrollY };
    drawing.current = { pointer: e.pointerId, o };
    el.dataset.drawing = "";
    hand.current = new Hand();
    hand.current.start(e.pageX - o.x, e.pageY - o.y, e.timeStamp, e.pointerType === "pen" ? e.pressure : 0);
    schedule();
  }

  function move(e: ReactPointerEvent<HTMLDivElement>) {
    const d = drawing.current;
    if (!d || e.pointerId !== d.pointer || !hand.current) return;
    const samples = e.nativeEvent.getCoalescedEvents?.() ?? [];
    for (const s of samples.length ? samples : [e.nativeEvent]) {
      hand.current.move(s.pageX - d.o.x, s.pageY - d.o.y, s.timeStamp, s.pointerType === "pen" ? s.pressure : 0);
    }
    schedule();
  }

  function up(e: ReactPointerEvent<HTMLDivElement>, cancelled = false) {
    const d = drawing.current;
    if (!d || e.pointerId !== d.pointer || !hand.current) return;
    drawing.current = null;
    delete root.current?.dataset.drawing;
    const { points, ink } = hand.current.end();
    hand.current = null;
    if (frame.current) cancelAnimationFrame(frame.current);
    frame.current = 0;
    live.current?.setAttribute("d", "");
    if (!cancelled) commit(points, ink);
  }

  // Undo: the last thing drawn goes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== "z" || !(e.metaKey || e.ctrlKey) || e.shiftKey) return;
      if ((e.target as Element | null)?.closest("input, textarea, [contenteditable]")) return;
      const last = latest.current.filter((i) => !i.leaving).at(-1);
      if (!last) return;
      e.preventDefault();
      rubOut((i) => i.stroke === last.stroke);
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [rubOut]);

  // ─── The pen shows how ───
  // Once the front page has written itself in, and if no one's started
  // drawing, the pen comes onto the sheet, boxes the blank paper beside the
  // headline (a Button) and circles "write" in it, through the same reading
  // as anyone's strokes. Not with reduced motion: there the page is still.
  useEffect(() => {
    const el = root.current;
    const hero = el?.querySelector<HTMLElement>(".guide-hero");
    const nib = pen.current;
    if (!el || !hero || !nib || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let seen = 0;
    const io = new IntersectionObserver(([entry]) => (seen = entry.intersectionRatio), { threshold: [0, 0.5, 0.75, 1] });
    io.observe(hero);
    const control = new AbortController();
    demo.current = control;
    const { signal } = control;

    const place = (x: number, y: number, lift: number, turn: number, opacity: number) => {
      nib.style.transform = `translate3d(${x.toFixed(1)}px, ${(y - lift * 7).toFixed(1)}px, 0) rotate(${turn.toFixed(2)}deg) scale(${1 + lift * 0.05})`;
      nib.style.opacity = String(opacity);
    };
    const frames = (ms: number, step: (u: number) => void) =>
      new Promise<void>((resolve, reject) => {
        const t0 = performance.now();
        const tick = (now: number) => {
          if (signal.aborted) return reject(signal.reason);
          const u = Math.min(1, (now - t0) / ms);
          step(u);
          if (u < 1) requestAnimationFrame(tick);
          else resolve();
        };
        requestAnimationFrame(tick);
      });
    const glide = (a: Point, b: Point, ms: number, from = 1, to = 1, opacity: [number, number] = [1, 1]) =>
      frames(ms, (u) => {
        const e = easeInOut(u);
        const arc = Math.sin(u * Math.PI) * Math.min(60, Math.hypot(b.x - a.x, b.y - a.y) * 0.18);
        place(
          a.x + (b.x - a.x) * e,
          a.y + (b.y - a.y) * e - arc,
          from + (to - from) * e,
          (b.x - a.x) * 0.004 * Math.sin(u * Math.PI),
          opacity[0] + (opacity[1] - opacity[0]) * easeOut(u),
        );
      });
    const write = (path: Timed[]) => {
      const h = new Hand();
      h.start(path[0].x, path[0].y, 0);
      hand.current = h;
      let i = 1;
      const end = path[path.length - 1].t;
      return frames(end, (u) => {
        const t = u * end;
        while (i < path.length && path[i].t <= t) {
          h.move(path[i].x, path[i].y, path[i].t);
          i++;
        }
        const p = path[Math.min(i, path.length - 1)];
        place(h.x, h.y, 0, (p.x - h.x) * 0.05, 1);
        live.current?.setAttribute("d", inkRibbon(h.ink));
      }).then(() => {
        const { points, ink } = h.end();
        hand.current = null;
        live.current?.setAttribute("d", "");
        commit(points, ink);
      });
    };

    async function show() {
      await document.fonts.ready;
      if (signal.aborted || seen < 0.6 || touched.current || document.visibilityState !== "visible") return;
      const box = el!.getBoundingClientRect();
      const at = (r: DOMRect): Rect => ({
        x: r.left - box.left,
        y: r.top - box.top,
        w: r.width,
        h: r.height,
      });
      const h1 = hero!.querySelector("h1");
      const lines = h1 ? [...h1.querySelectorAll(":scope > span")] : [];
      const [one, two] = lines.map((l) => {
        const range = document.createRange();
        range.selectNodeContents(l);
        return at(range.getBoundingClientRect());
      });
      const node = lines[1] ? textNodes(lines[1]).find((n) => n.data.includes("write")) : undefined;
      if (!one || !two || !node) return;
      const range = document.createRange();
      range.setStart(node, node.data.indexOf("write"));
      range.setEnd(node, node.data.indexOf("write") + 5);
      const word = at(range.getBoundingClientRect());
      const sheet = at(hero!.getBoundingClientRect());
      const room = sheet.x + sheet.w - (one.x + one.w);
      const paths: Timed[][] = [];
      if (room >= 300) {
        const w = clamp(room * 0.4, 170, 220);
        const x = one.x + one.w + clamp(room * 0.16, 48, 110);
        paths.push(
          boxPath(hashSeed("demo-box"), {
            x,
            y: one.y + one.h * 0.5 - 30,
            w,
            h: 58,
          }),
        );
      }
      paths.push(loopPath(hashSeed("demo-loop"), word));
      nib!.style.transition = "";
      const first = paths[0][0];
      await glide({ x: first.x + 240, y: first.y - 200 }, first, 650, 1, 0, [0, 1]);
      for (let i = 0; i < paths.length; i++) {
        await write(paths[i]);
        const end = paths[i][paths[i].length - 1];
        const after = paths[i + 1]?.[0];
        if (after) await glide(end, after, 520, 0, 0);
      }
      const last = paths[paths.length - 1].at(-1)!;
      await glide(last, { x: last.x + 220, y: last.y + 120 }, 700, 0, 1, [1, 0]);
    }

    const start = setTimeout(() => show().catch(() => {}), 3000);
    // Anyone starting to draw takes over from the pen.
    signal.addEventListener("abort", () => {
      nib.style.transition = "opacity 200ms";
      nib.style.opacity = "0";
      if (hand.current && !drawing.current) {
        hand.current = null;
        live.current?.setAttribute("d", "");
      }
    });
    return () => {
      clearTimeout(start);
      io.disconnect();
      control.abort();
    };
  }, [commit]);

  const used = useMemo(() => new Set(items.filter((i) => !i.leaving).map((i) => i.part)), [items]);
  const at = (part: number): Point => origins[part] ?? { x: 0, y: 0 };

  return (
    <SketchContext.Provider value={{ penUp, setPenUp }}>
      <div
        ref={root}
        className="sketch"
        data-pen={penUp ? "up" : undefined}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={(e) => up(e)}
        onPointerCancel={(e) => up(e, true)}
      >
        {children}
        <svg aria-hidden="true" className="ink-sketch sketch-ink text-ink">
          {items.map((i) => {
            const o = at(i.part);
            if (i.type === "ink")
              return (
                <path
                  key={i.id}
                  d={i.d}
                  transform={`translate(${o.x} ${o.y})`}
                  className="ink-ribbon sketch-raw"
                  data-fading={i.fading ? "" : undefined}
                  data-leaving={i.leaving ? "" : undefined}
                />
              );
            if (i.type === "mark" && i.mark !== "redact")
              return (
                <g key={i.id} className="sketch-mark" data-leaving={i.leaving ? "" : undefined}>
                  <MarkInk id={i.id} mark={i.mark} rect={i.rect} at={o} />
                </g>
              );
            return null;
          })}
          <path ref={live} className="ink-ribbon" />
        </svg>
        <div className="sketch-layer">
          {items.map((i) => {
            const o = at(i.part);
            if (i.type === "mark")
              return [
                i.mark === "redact" && <Scribbled key={i.id} id={i.id} rect={i.rect} at={o} leaving={i.leaving} />,
                <Code key={`${i.id}-code`} text={markCode[i.mark]} rect={inkRect(i.mark, i.rect)} spot={i.spot} at={o} leaving={i.leaving} />,
              ];
            if (i.type === "thing")
              return [
                <Thing key={i.id} item={i} at={o} />,
                <Code key={`${i.id}-code`} text={thingCode[i.thing](i.text)} rect={i.rect} spot={i.spot} at={o} leaving={i.leaving} />,
              ];
            return null;
          })}
          {[...used].map((part) => (
            <button
              key={`rub-${part}`}
              type="button"
              className="sketch-rubber"
              style={{ top: origins[part]?.under ?? 0 }}
              onClick={() => {
                rubOut((i) => i.part === part);
                say("Rubbed out.");
              }}
            >
              <Rubber />
              <span className="sketch-rubber-label">Rub out</span>
              <span className="sr-only">what you drew here</span>
            </button>
          ))}
        </div>
        <Pen ref={pen} size={52} className="sketch-pen" />
        <p className="sr-only" aria-live="polite">
          {status}
        </p>
      </div>
    </SketchContext.Provider>
  );
}

/** Under the headline: what the page will take, and on a touch screen, the pen to take it with. */
export function SketchHint() {
  const { penUp, setPenUp } = useSketch();
  return (
    <div className="guide-try">
      <Button variant="outline" size="sm" seed="pick-up-pen" aria-pressed={penUp} onClick={() => setPenUp(!penUp)} className="guide-try-pen">
        {penUp ? "Put the pen down" : "Pick up the pen"}
      </Button>
      <p>
        {penUp
          ? "Draw here with your finger: box a blank spot, circle a word, scribble one out."
          : "Go on, write on it: box a blank spot, circle a word, scribble one out."}
      </p>
    </div>
  );
}
