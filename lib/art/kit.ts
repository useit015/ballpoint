// A small kit for drawing with a pen in code: seeded noise, and path helpers
// that keep the output short (one decimal, relative moves, no separators the
// parser doesn't need). Everything is deterministic, so the server and the
// browser draw the same picture.

import { createRng, hashSeed, type Rng } from "../../registry/ballpoint/lib/ink-sketch.ts";

export { createRng, hashSeed };
export type { Rng };

export type Pt = readonly [number, number];

/**
 * Paths are written on a grid UNIT times finer than the scene's own units,
 * in whole numbers: half a unit is finer than a pen line is wide, and
 * integers cost a third of the bytes of decimals.
 */
export const UNIT = 2;

/** A coordinate as it is written into a path: on the grid, with no negative zero. */
export const f = (n: number) => {
  const r = Math.round(n * UNIT);
  return r === 0 ? 0 : r;
};

export const clamp = (v: number, lo = 0, hi = 1) => (v < lo ? lo : v > hi ? hi : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const smoothstep = (a: number, b: number, v: number) => {
  const t = clamp((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/** A random number in [-k, k]. */
export const spread = (r: Rng, k: number) => (r() * 2 - 1) * k;

/** Smooth 1D value noise in [-1, 1]. */
export function noise(seed: number) {
  const r = createRng(seed);
  const table = Array.from({ length: 256 }, () => r() * 2 - 1);
  return (x: number) => {
    const i = Math.floor(x);
    const t = x - i;
    const a = table[i & 255];
    const b = table[(i + 1) & 255];
    const s = t * t * t * (t * (t * 6 - 15) + 10);
    return a + (b - a) * s;
  };
}

/** Layered noise, normalised to about [-1, 1]. */
export function fbm(n: (x: number) => number, x: number, octaves = 4, gain = 0.5) {
  let sum = 0;
  let amp = 1;
  let norm = 0;
  let freq = 1;
  for (let i = 0; i < octaves; i++) {
    sum += n(x * freq + i * 17.3) * amp;
    norm += amp;
    amp *= gain;
    freq *= 2;
  }
  return sum / norm;
}

const num = (n: number) => String(n);

/** Joins path tokens, dropping the space where a minus sign already separates. */
function join(tokens: string[]) {
  let out = "";
  for (const t of tokens) out += out && !/^[-a-zA-Z]/.test(t) && !/[a-zA-Z]$/.test(out) ? ` ${t}` : t;
  return out;
}

/** Straight pen lines through the points: M, then relative l. */
export function poly(pts: readonly Pt[]) {
  if (pts.length < 2) return "";
  let px = f(pts[0][0]);
  let py = f(pts[0][1]);
  const tokens = [`M${num(px)}`, num(py), "l"];
  for (let i = 1; i < pts.length; i++) {
    const x = f(pts[i][0]);
    const y = f(pts[i][1]);
    tokens.push(num(x - px), num(y - py));
    px = x;
    py = y;
  }
  return join(tokens);
}

/** Several polylines as one path (they draw together; use for static fills). */
export const polys = (lines: readonly (readonly Pt[])[]) => lines.map(poly).join("");

/**
 * Many short straight pulls as one path, with the `l` written once.
 */
export function pulls(lines: readonly (readonly Pt[])[]) {
  let d = "";
  for (const line of lines) {
    let px = f(line[0][0]);
    let py = f(line[0][1]);
    d += `M${px} ${py}l`;
    let first = true;
    for (let i = 1; i < line.length; i++) {
      const x = f(line[i][0]);
      const y = f(line[i][1]);
      const dx = x - px;
      const dy = y - py;
      d += `${first ? "" : " "}${dx}${dy < 0 ? "" : " "}${dy}`;
      first = false;
      px = x;
      py = y;
    }
  }
  return d;
}

/**
 * A smooth pen line: quadratic Béziers through the midpoints of the
 * points, so it is round where the points are many and straight where few.
 */
export function curve(pts: readonly Pt[]) {
  if (pts.length < 3) return poly(pts);
  let px = f(pts[0][0]);
  let py = f(pts[0][1]);
  let d = `M${num(px)} ${num(py)}`;
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  const first = mid(pts[0], pts[1]);
  let ex = f(first[0]);
  let ey = f(first[1]);
  d += `l${num(ex - px)} ${num(ey - py)}`;
  px = ex;
  py = ey;
  for (let i = 1; i < pts.length - 1; i++) {
    const c = pts[i];
    const m = mid(pts[i], pts[i + 1]);
    const cx = f(c[0]);
    const cy = f(c[1]);
    ex = f(m[0]);
    ey = f(m[1]);
    d += `${i === 1 ? "q" : ""}${num(cx - px)} ${num(cy - py)} ${num(ex - px)} ${num(ey - py)}${i < pts.length - 2 ? " " : ""}`;
    px = ex;
    py = ey;
  }
  const last = pts[pts.length - 1];
  d += `L${num(f(last[0]))} ${num(f(last[1]))}`;
  return d;
}

/** A line bowed to one side by `bow` (a fraction of its length), as a quadratic. */
export function bowed(a: Pt, b: Pt, bow: number): string {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const cx = a[0] + dx / 2 - dy * bow;
  const cy = a[1] + dy / 2 + dx * bow;
  return `M${num(f(a[0]))} ${num(f(a[1]))}Q${num(f(cx))} ${num(f(cy))} ${num(f(b[0]))} ${num(f(b[1]))}`;
}

/** One continuous back-and-forth scribble between two edge lines. */
export function zigzag(top: readonly Pt[], bottom: readonly Pt[]): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < top.length; i++) out.push(i % 2 === 0 ? top[i] : bottom[i]);
  return out;
}

/** A polyline sampled at a step along x from f(x). */
export function sample(x0: number, x1: number, step: number, fn: (x: number) => number): Pt[] {
  const pts: Pt[] = [];
  for (let x = x0; x < x1; x += step) pts.push([x, fn(x)]);
  pts.push([x1, fn(x1)]);
  return pts;
}

/** Angular crags: the profile's height at random breakpoints, joined by straight lines. */
export function crags(r: Rng, x0: number, x1: number, fn: (x: number) => number, min: number, max: number): Pt[] {
  const pts: Pt[] = [[x0, fn(x0)]];
  let x = x0;
  while (x < x1) {
    x = Math.min(x1, x + min + r() * (max - min));
    pts.push([x, fn(x)]);
  }
  return pts;
}

/** The height of a polyline at x. */
export function heightAt(line: readonly Pt[], x: number) {
  if (x <= line[0][0]) return line[0][1];
  for (let i = 1; i < line.length; i++) {
    if (x <= line[i][0]) {
      const [ax, ay] = line[i - 1];
      const [bx, by] = line[i];
      return ay + ((by - ay) * (x - ax)) / (bx - ax || 1);
    }
  }
  return line[line.length - 1][1];
}

/** One drawn mark: a path, how heavy the pen, and when and how it goes on. */
export type Piece = {
  d: string;
  /** Line weight, in viewBox units. */
  w: number;
  /** Pressure, 0 to 1. */
  o?: number;
  /** ms before it starts, from the scene's start. */
  at: number;
  /** ms it takes. */
  dur: number;
  /** "draw": the pen runs along it. "sweep": a cluster of strokes the hand works across, left to right (or down). */
  how: "draw" | "sweep";
  /** A sweep that works down the page rather than across it. */
  down?: boolean;
  /** Depth: 0 far, 1 middle, 2 near. Each depth is its own layer, for parallax. */
  z: 0 | 1 | 2;
  /** Only drawn by day or by night. */
  only?: "day" | "night";
  /** A piece of the sky or a thing that moves: its own class. */
  cls?: string;
  /** Custom properties for its CSS (how far a walker goes, say). */
  vars?: Record<string, string | number>;
  /** Pieces next to each other with the same group are one thing: they move together (a boat and the man in it). */
  g?: string;
};

export type Scene = {
  /** The scene's size in its own units (paths are UNIT times finer). */
  box: readonly [number, number];
  pieces: Piece[];
};

export type Measure = { len: number; start: Pt; end: Pt };

/**
 * How long a path is, in the scene's units, and where it starts and ends.
 * Reads what this kit writes: M/m, L/l, Q/q, A/a, Z.
 */
export function measure(d: string): Measure {
  const re = /([MmLlQqAaZz])|(-?\d*\.?\d+)/g;
  const t: (string | number)[] = [];
  for (let m = re.exec(d); m; m = re.exec(d)) t.push(m[1] ?? Number(m[2]));
  let i = 0;
  let cmd = "";
  let x = 0;
  let y = 0;
  let len = 0;
  let start: Pt | undefined;
  const n = () => t[i++] as number;
  while (i < t.length) {
    if (typeof t[i] === "string") cmd = t[i++] as string;
    if (cmd === "M" || cmd === "m") {
      x = cmd === "m" ? x + n() : n();
      y = cmd === "m" ? y + n() : n();
      start ??= [x, y];
      cmd = cmd === "m" ? "l" : "L";
    } else if (cmd === "L" || cmd === "l") {
      const nx = cmd === "l" ? x + n() : n();
      const ny = cmd === "l" ? y + n() : n();
      len += Math.hypot(nx - x, ny - y);
      [x, y] = [nx, ny];
    } else if (cmd === "Q" || cmd === "q") {
      const cx = cmd === "q" ? x + n() : n();
      const cy = cmd === "q" ? y + n() : n();
      const nx = cmd === "q" ? x + n() : n();
      const ny = cmd === "q" ? y + n() : n();
      len += (2 * Math.hypot(nx - x, ny - y) + Math.hypot(cx - x, cy - y) + Math.hypot(nx - cx, ny - cy)) / 3;
      [x, y] = [nx, ny];
    } else if (cmd === "A" || cmd === "a") {
      const r = n();
      i += 4;
      const nx = cmd === "a" ? x + n() : n();
      const ny = cmd === "a" ? y + n() : n();
      len += Math.max(Math.hypot(nx - x, ny - y), Math.PI * r * 0.9);
      [x, y] = [nx, ny];
    } else i++;
  }
  return { len: len / UNIT, start: [(start?.[0] ?? 0) / UNIT, (start?.[1] ?? 0) / UNIT], end: [x / UNIT, y / UNIT] };
}

/**
 * One pen laying strokes down one after another from `from` ms: each starts
 * when the one before it ends, plus the hop between them, and takes as long
 * as its length asks at `speed` (units per ms). What it is given is returned
 * timed, and `end` is when the last stroke lifts.
 */
export function track(from: number, speed: number) {
  let t = from;
  let at: Pt | undefined;
  return {
    get end() {
      return t;
    },
    lay(p: Piece): Piece {
      const m = measure(p.d);
      const hop = at ? Math.min(260, Math.max(70, Math.hypot(m.start[0] - at[0], m.start[1] - at[1]) / 2.4)) : 0;
      const piece = { ...p, at: Math.round(t + hop), dur: Math.round(Math.max(160, m.len / speed)) };
      t = piece.at + piece.dur;
      at = m.end;
      return piece;
    },
  };
}

/** The scene's pieces, with a shared clock: adds a delay to every one. */
export const after = (pieces: Piece[], at: number): Piece[] => pieces.map((p) => ({ ...p, at: p.at + at }));

/**
 * The runs of a skyline that nothing in front hides: resampled along x, a
 * point is kept while it is above the nearer ridge `hide(x)`.
 */
export function visibleRuns(line: readonly Pt[], hide: (x: number) => number, step = 3): Pt[][] {
  const runs: Pt[][] = [];
  let run: Pt[] = [];
  const x0 = line[0][0];
  const x1 = line[line.length - 1][0];
  for (let x = x0; x <= x1 + step * 0.5; x += step) {
    const px = Math.min(x, x1);
    const y = heightAt(line, px);
    if (y < hide(px) - 0.6) run.push([px, y]);
    else if (run.length) {
      if (run.length > 2) runs.push(run);
      run = [];
    }
  }
  if (run.length > 2) runs.push(run);
  return runs;
}

/** A ring of points, the way a pen draws one: it overshoots where it started, and is never quite round. */
export function ringPts(r: Rng, cx: number, cy: number, rx: number, ry = rx, turns = 1.06): Pt[] {
  const pts: Pt[] = [];
  const start = -Math.PI * (0.5 + r() * 0.3);
  const steps = 16;
  for (let i = 0; i <= steps; i++) {
    const a = start + (i / steps) * turns * Math.PI * 2;
    const k = 1 + 0.035 * Math.sin(a * 2 + 1) + spread(r, 0.012) - (i / steps) * 0.04;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return pts;
}
