import { Stroke, type DrawMode } from "@/registry/ballpoint/lib/ink";
import { chevronStroke, crossStroke, dashStroke, dotStroke, hashSeed, lineStroke, plusStroke, ringStroke, tickStroke } from "@/registry/ballpoint/lib/ink-sketch";

// Small icons drawn with the pen on a 16px grid: the close cross, ticks,
// chevrons and the like that components need inside their controls.
// Server-safe, and seeded by name, so a glyph is the same drawing wherever
// it appears.

type Glyph = { paths: string[]; width: number };

const seed = (name: string) => hashSeed(`glyph-${name}`);
function shift(d: string, dx: number, dy: number) {
  // Every number pair in our stroke paths is an absolute x,y point.
  return d.replace(/(-?\d*\.?\d+)[ ,](-?\d*\.?\d+)/g, (_, x: string, y: string) => `${+(+x + dx).toFixed(2)} ${+(+y + dy).toFixed(2)}`);
}

const glyphs = {
  close: { paths: [shift(crossStroke(seed("close"), 12, { inset: 0.1 }), 2, 2)], width: 1.7 },
  check: { paths: [shift(tickStroke(seed("check"), 11), 2.5, 3.2)], width: 1.8 },
  "chevron-down": { paths: [shift(chevronStroke(seed("down"), 10, 6, "down"), 3, 5)], width: 1.6 },
  "chevron-up": { paths: [shift(chevronStroke(seed("up"), 10, 6, "up"), 3, 5)], width: 1.6 },
  "chevron-right": { paths: [shift(chevronStroke(seed("right"), 6, 10, "right"), 5, 3)], width: 1.6 },
  "chevron-left": { paths: [shift(chevronStroke(seed("left"), 6, 10, "left"), 5, 3)], width: 1.6 },
  dot: { paths: [shift(dotStroke(seed("dot"), 3.2), 8, 8)], width: 1.6 },
  minus: { paths: [shift(dashStroke(seed("minus"), 12), 2, 8)], width: 1.7 },
  plus: { paths: [shift(plusStroke(seed("plus"), 12), 2, 2)], width: 1.7 },
  // An exclamation mark and an i: a pull and a dot, the dot below or above.
  alert: { paths: [lineStroke(seed("alert"), [8, 2.2], [8.2, 9.6], { bow: 0.4, jitter: 0.2 }), shift(dotStroke(seed("alert-dot"), 1.1), 8.2, 13.2)], width: 1.8 },
  info: { paths: [shift(dotStroke(seed("info-dot"), 1.1), 8, 3.2), lineStroke(seed("info"), [7.9, 6.6], [8.1, 13.8], { bow: 0.4, jitter: 0.2 })], width: 1.8 },
  // A loop to spin while something loads.
  loading: { paths: [shift(ringStroke(seed("loading"), 12, { turns: 0.8 }), 2, 2)], width: 1.6 },
} satisfies Record<string, Glyph>;

export type GlyphName = keyof typeof glyphs;

/**
 * A pen-drawn icon, 16px by default (size it with className). `draw` makes
 * it draw itself in: "mount" as it appears, "checked" while its parent
 * carries data-checked (a menu's checkbox item indicator, say).
 */
export function InkGlyph({ name, draw = "none", duration = 240, className }: { name: GlyphName; draw?: DrawMode; duration?: number; className?: string }) {
  const glyph: Glyph = glyphs[name];
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 16 16"
      data-slot="ink-glyph"
      data-glyph={name}
      className={["ink-sketch size-4 shrink-0", className].filter(Boolean).join(" ")}
    >
      {glyph.paths.map((d, i) => (
        <Stroke key={i} d={d} draw={draw} delay={i * 140} duration={duration} width={glyph.width} />
      ))}
    </svg>
  );
}
