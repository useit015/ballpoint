// Small things drawn in the margins: arrows, a smiley, a pine,
// a pen. Each is a scene of its own (see kit.ts), a few strokes the
// pen pulls in order.

import { createRng, curve, hashSeed, poly, polys, ringPts as ring, spread, type Piece, type Pt, type Scene } from "./kit.ts";
import { pine } from "./nature.ts";

const draw = (d: string, at: number, dur: number, w = 1.3, extra: Partial<Piece> = {}): Piece => ({ d, w, at, dur, how: "draw", z: 0, ...extra });
const fade = (d: string, at: number, dur: number, w = 1.1, o = 0.9): Piece => ({ d, w, o, at, dur, how: "sweep", z: 0 });

/**
 * A curved pull from `a` to `b`, with a head flicked on the end. `bend`
 * leans it to one side (a fraction of its length).
 */
export function arrow(seed: string, a: Pt, b: Pt, bendBy = 0.25, delay = 0): Scene & { origin: Pt } {
  const r = createRng(hashSeed(seed));
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  // A long arrow bows no more than a hand's span, however far it goes.
  const bend = (Math.sign(bendBy) * Math.min(Math.abs(bendBy) * len, 30)) / len;
  const mid: Pt = [a[0] + dx * 0.5 + nx * bend * len, a[1] + dy * 0.5 + ny * bend * len];
  const q1: Pt = [a[0] + dx * 0.22 + nx * bend * len * 0.8 + spread(r, 1), a[1] + dy * 0.22 + ny * bend * len * 0.8 + spread(r, 1)];
  const q2: Pt = [a[0] + dx * 0.78 + nx * bend * len * 0.7 + spread(r, 1), a[1] + dy * 0.78 + ny * bend * len * 0.7 + spread(r, 1)];
  // The head sits along the way the line arrives.
  const back = Math.atan2(q2[1] - b[1], q2[0] - b[0]);
  const size = 7 + r() * 2;
  const wing = (turn: number): Pt => [b[0] + Math.cos(back + turn) * size, b[1] + Math.sin(back + turn) * size];
  const flick = [0.5 + r() * 0.12, -0.55 - r() * 0.1];
  const pad = 10;
  const xs = [a[0], b[0], mid[0]];
  const ys = [a[1], b[1], mid[1]];
  const x0 = Math.min(...xs) - pad;
  const y0 = Math.min(...ys) - pad;
  const w = Math.max(...xs) + pad - x0;
  const h = Math.max(...ys) + pad - y0;
  const move = (p: Pt): Pt => [p[0] - x0, p[1] - y0];
  const shiftD = (pts: Pt[]) => pts.map(move);
  return {
    box: [w, h],
    origin: [x0, y0],
    pieces: [
      draw(curve(shiftD([a, q1, mid, q2, b])), delay, 520 + len * 3, 1.3),
      draw(poly(shiftD([wing(flick[0]), b, wing(flick[1])])), delay + 520 + len * 3 - 60, 180, 1.3),
    ],
  };
}

/** A smiley: a ring, two ticks for eyes, a smile. */
export function smiley(seed = "smiley", delay = 0): Scene {
  const r = createRng(hashSeed(seed));
  return {
    box: [40, 40],
    pieces: [
      draw(curve(ring(r, 20, 20, 15.5)), delay, 520, 1.3),
      draw(poly([[14.6, 14.6], [14.8, 18.2]]), delay + 560, 80, 1.5),
      draw(poly([[25.2, 14.4], [25, 18]]), delay + 660, 80, 1.5),
      draw(curve([[11.4, 23.4], [14.8, 28.6], [20, 30.4], [25.2, 28.8], [28.8, 23.2]]), delay + 760, 260, 1.4),
    ],
  };
}

/** A little pine for a margin. */
export function pineDoodle(seed = "pine", h = 96, delay = 0): Scene {
  const r = createRng(hashSeed(seed));
  const w = h * 0.56;
  const pieces = pine(r, { cx: w / 2, base: h - 2, h: h - 4, fat: 1.1, z: 0, at: delay, hatch: 1, w: 1.1 });
  return { box: [w, h], pieces };
}

/** A star pulled in one go, with a few strokes of shine. */
export function star(seed = "star", delay = 0): Scene {
  const r = createRng(hashSeed(seed));
  const pts: Pt[] = [];
  for (let i = 0; i < 11; i++) {
    const a = ((i * 36 - 90) * Math.PI) / 180;
    const k = i % 2 ? 6.4 : 15;
    pts.push([22 + Math.cos(a) * k + spread(r, 0.6), 23 + Math.sin(a) * k + spread(r, 0.6)]);
  }
  return {
    box: [44, 44],
    pieces: [
      draw(poly(pts), delay, 460, 1.4),
      draw(poly([[36, 4], [38, 9]]), delay + 480, 80, 1.1),
      draw(poly([[40, 8], [35, 8.6]]), delay + 560, 80, 1.1),
    ],
  };
}

/** A little burst of lines: something just happened. */
export function burst(seed = "burst", delay = 0): Scene {
  const r = createRng(hashSeed(seed));
  const lines: Piece[] = [];
  for (let i = 0; i < 5; i++) {
    const a = (-0.95 + i * 0.5) * (Math.PI / 2) - Math.PI / 2 + spread(r, 0.08);
    const d0 = 8 + r() * 2;
    const d1 = 15 + r() * 7;
    lines.push(draw(poly([[24 + Math.cos(a) * d0, 28 + Math.sin(a) * d0], [24 + Math.cos(a) * d1, 28 + Math.sin(a) * d1]]), delay + i * 70, 120, 1.4));
  }
  return { box: [48, 32], pieces: lines };
}

/** An underline swept under a phrase, snapped back and gone over once. */
export function swoosh(seed: string, w: number, delay = 0): Scene {
  const r = createRng(hashSeed(seed));
  const h = 18;
  const a: Pt[] = [[1, 9 + spread(r, 1)], [w * 0.3, 5 + spread(r, 1)], [w * 0.62, 4 + spread(r, 1)], [w * 0.98, 6 + spread(r, 1)]];
  const b: Pt[] = [[w * 0.9, 9 + spread(r, 0.8)], [w * 0.55, 12 + spread(r, 1)], [w * 0.24, 11 + spread(r, 1)], [w * 0.12, 13 + spread(r, 1)]];
  return { box: [w, h], pieces: [draw(curve(a), delay, 520, 1.8), draw(curve(b), delay + 440, 380, 1.2, { o: 0.75 })] };
}

/**
 * The pen that draws the picture, in pixels: tip at the origin, pointing
 * down, about 64 long. The barrel is filled with paper (in CSS), so it hides
 * what it passes over.
 */
export const penShape = {
  barrel: "M0 0L-1.9 -7L-2.8 -22L-2.8 -55Q-2.8 -59 -1.6 -60L1.6 -60Q2.8 -59 2.8 -55L2.8 -22L1.9 -7Z",
  tip: "M0 0L-1.9 -7L1.9 -7Z",
  clip: "M2.8 -56L4.5 -54.5L4.5 -33L2.8 -32",
  clicker: "M-1.5 -60L-1.5 -63.2L1.5 -63.2L1.5 -60",
  lines: "M-2.8 -22L2.8 -22M-2.8 -37L2.8 -37M-2.4 -13.5L2.4 -13.5",
} as const;

/** A paperclip, in one pull of wire: the small loop inside the big one. */
export function paperclip(seed = "clip", delay = 0): Scene {
  const r = createRng(hashSeed(seed));
  const j = (v: number) => v + spread(r, 0.35);
  const pts: Pt[] = [
    [15, 44], [15, 24], [13, 18], [10, 20], [9, 26], [9, 48], [11, 57], [16, 60], [21, 57], [23, 48], [23, 17], [21, 8], [16, 4], [11, 7], [9, 14],
  ].map(([x, y]) => [j(x), j(y)] as Pt);
  return { box: [30, 66], pieces: [draw(curve(pts), delay, 900, 1.5)] };
}

/** A ballpoint standing on its tip: cap and clip, a band, a taper, and shade down one side. */
export function penDoodle(seed = "pen", delay = 0): Scene {
  const r = createRng(hashSeed(seed));
  const j = (v: number) => v + spread(r, 0.3);
  const barrel = poly([[j(4), 18], [j(4.6), 102], [j(12), 124], [j(19.4), 102], [j(20), 18]]);
  const cap = curve([[j(4), 18], [j(4), 8], [j(8), 3.5], [j(12), 3], [j(16), 3.5], [j(20), 8], [j(20), 18]]);
  const bands = poly([[4, 30], [20, 30.4]]) + poly([[4.4, 96], [19.6, 96.4]]);
  const clip = poly([[j(22.5), 9], [j(24.5), 12], [j(24), 52], [j(21.6), 52]]);
  const hatch: Pt[][] = [];
  for (let i = 0; i < 9; i++) hatch.push([[15 + (i % 2) * 2.2, 36 + i * 6.6], [14.6 + (i % 2) * 2.2, 40 + i * 6.6]]);
  return {
    box: [28, 128],
    pieces: [
      draw(barrel + cap, delay, 900, 1.3),
      draw(bands, delay + 500, 300, 1.1),
      draw(clip, delay + 700, 300, 1.2),
      fade(polys(hatch), delay + 900, 400, 1, 0.85),
      draw(poly([[9.5, 114], [12, 124], [14.5, 114]]), delay + 800, 200, 1.6),
    ],
  };
}
