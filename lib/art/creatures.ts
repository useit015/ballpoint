// What lives in the pictures besides people (people.ts): a bird's wings in
// the four beats of a flap, the several flames a fire flickers between, a
// fish, a man in a boat and the rod he fishes with, a speech bubble. Each is
// a path (or a few) in its own space, in the scene's units, to be placed and
// moved by the component that owns it. All are pure functions of their seeds.

import { createRng, hashSeed, spread, type Pt } from "./kit.ts";

const r1 = (n: number) => Math.round(n * 10) / 10;
const p = (v: Pt) => `${r1(v[0])} ${r1(v[1])}`;

/** A pen line through points: straight at the ends, quadratic through the middle ones. */
export function soft(ps: readonly Pt[], closed = false): string {
  if (ps.length < 3) return `M${p(ps[0])}${ps.slice(1).map((v) => `L${p(v)}`).join("")}`;
  const pts = closed ? [...ps, ps[0], ps[1]] : ps;
  const mid = (a: Pt, b: Pt): Pt => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  let d = closed ? `M${p(mid(pts[0], pts[1]))}` : `M${p(pts[0])}L${p(mid(pts[0], pts[1]))}`;
  for (let i = 1; i < pts.length - 1; i++) d += `Q${p(pts[i])} ${p(mid(pts[i], pts[i + 1]))}`;
  if (!closed) d += `L${p(pts[pts.length - 1])}`;
  return d;
}

/** A pen ring that overshoots where it started. */
export function ring(seed: string, cx: number, cy: number, rx: number, ry = rx, turns = 1.05): Pt[] {
  const r = createRng(hashSeed(seed));
  const start = -Math.PI * (0.55 + r() * 0.25);
  const pts: Pt[] = [];
  for (let i = 0; i <= 12; i++) {
    const a = start + (i / 12) * Math.PI * 2 * turns;
    const k = 1 + 0.035 * Math.sin(a * 2 + 1) + spread(r, 0.012) - (i / 12) * 0.045;
    pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
  }
  return pts;
}

// ─── Birds ──────────────────────────────────────────────────────────────

/**
 * A bird's wings through a beat of a flap, in the order they are shown:
 * level, raised, level, lowered. Each is one pen stroke, wingtip to wingtip
 * through the body at the origin; `s` is half the wingspan.
 */
export function birdPoses(s: number): string[] {
  const wing = (tip: number, lift: number, curl: number) => `M${p([-s, tip])}Q${p([-s * 0.5, lift])} ${p([0, 0])}Q${p([s * 0.5, lift - curl])} ${p([s, tip - curl * 0.5])}`;
  return [wing(-s * 0.28, -s * 0.62, s * 0.08), wing(-s * 0.95, -s * 0.9, s * 0.1), wing(-s * 0.2, -s * 0.5, s * 0.08), wing(s * 0.42, -s * 0.18, s * 0.06)];
}

// ─── Fire ───────────────────────────────────────────────────────────────

/**
 * The flames of a fire, a different shape each time it is drawn, for the fire
 * to flicker between: an outer flame with a tongue to one side, and a small
 * inner one, rising from the origin (y up is negative).
 */
export function flameShapes(n = 6, seed = "flames"): { outer: string; inner: string }[] {
  const r = createRng(hashSeed(seed));
  return Array.from({ length: n }, (_, i) => {
    const side = i % 2 ? 1 : -1;
    const h = 15 + r() * 6 + (i === 0 ? 2 : 0);
    const lean = side * (0.8 + r() * 2.6);
    const tongue = h * (0.5 + r() * 0.18);
    const q = (cx: number, cy: number, x: number, y: number) => `Q${r1(cx)} ${r1(cy)} ${r1(x)} ${r1(y)}`;
    const outer =
      `M-4.6 0` +
      q(-6.6, -h * 0.34, -3.4, -h * 0.58) +
      q(-3 + lean * 0.2, -h * 0.82, -0.4 + lean, -h) +
      q(0.6 + lean * 0.3, -h * 0.74, 1.2 + lean * 0.2, -h * 0.58) +
      q(3.2, -h * 0.74 + side, 3.4 + side * 1.2, -tongue) +
      q(6.8, -h * 0.28, 4.6, 0) +
      q(0, 1.4, -4.6, 0);
    const inner = `M-1.8 -0.4` + q(-3, -h * 0.28, -0.6 + lean * 0.15, -h * 0.52) + q(0.4, -h * 0.3, 1.6, -h * 0.24) + q(2.2, -h * 0.1, 1.6, -0.4);
    return { outer, inner };
  });
}

// ─── The lake ───────────────────────────────────────────────────────────

/** A fish, nose to the right, about 11 long, with its tail and an eye: for one that leaps. */
export function fish(): { body: string; tail: string; eye: string } {
  return {
    body: soft([[-5, 0], [-2, -2.8], [2, -3], [5.6, -0.2], [2.2, 2.6], [-2, 2.4]], true),
    tail: soft([[-5, 0], [-8.2, -3.2], [-7.2, 0], [-8.2, 3.2], [-5, 0]]),
    eye: `M3.2 -1l0.1 0.1`,
  };
}

/**
 * A rowing boat with a man fishing from it, in units of its own: the waterline
 * under the middle of the hull is the origin, the man faces right. Each part
 * is its own path, so the rod can bend and the line drop on its own.
 */
export function boatParts() {
  const hull = soft([[-24, -3], [-19, 2.4], [-8, 4.8], [8, 4.8], [19, 2.4], [26, -4]]) + soft([[-24, -3], [-2, -2.2], [26, -4]]);
  const oar = soft([[-6, -3], [-12, 1.5], [-17, 6.5]]);
  const man =
    soft(ring("boat-head", -3, -17.2, 2.4)) +
    // a cap, with a peak toward the water
    soft([[-5.5, -18.2], [-3.4, -20.4], [-0.6, -19.4]]) +
    `M-0.2 -19.2L2.6 -18.7` +
    // his back, and his thighs along the seat
    soft([[-3.2, -14.4], [-4.8, -8.8], [-4.2, -3.2]]) +
    soft([[-4.2, -3.2], [2, -4.8], [6.4, -3.4]]) +
    soft([[6.4, -3.4], [7.2, 0], [6.4, 2.4]]);
  const arm = soft([[-3, -12.2], [1.6, -9.6], [6, -11.4]]);
  const rod = soft([[5.4, -11.6], [14, -21], [26.4, -32.4]]);
  const line = soft([[26.4, -32.4], [29.4, -20], [30.6, -7]]);
  return { hull, oar, man, arm, rod, line, bobber: soft(ring("boat-bobber", 30.8, -4, 1.6), true) + `M30.8 -5.8l0 -2.4`, hand: [6, -11.4] as Pt, tip: [26.4, -32.4] as Pt };
}

/** A tin camp mug, about 8 wide and 9 tall, standing on the origin, with the flat stone it rests on and a wisp of steam. */
export function mug() {
  return {
    body: soft([[-4.2, -9], [-3.6, -0.6], [-3.1, 0], [3.1, 0], [3.7, -0.6], [4.3, -9]]),
    rim: soft(ring("mug-rim", 0, -9, 4.3, 1.2, 1.04)),
    band: soft([[-3.9, -6.2], [-0.4, -5.6], [3.9, -6.1]]),
    handle: soft([[4.1, -7.6], [7.4, -7.2], [7.6, -3.4], [3.6, -2.4]]),
    stone: soft(ring("mug-stone", 0.5, 1.6, 7.2, 1.7, 1.03)),
    steam: soft([[-1, -11], [1.2, -14], [-0.8, -17], [0.8, -20]]),
  };
}

/** A man's head and hand, as they poke out of a tent: cap, face, a hand up and waving. */
export function peek(seed: string) {
  return {
    head: soft(ring(`${seed}-head`, 0, 0, 4.2)),
    cap: soft([[-4.6, -1.2], [-3.6, -5.2], [0.2, -6.3], [3.8, -4.4], [4.6, -1.2]]) + `M-5.2 -1.4L5.4 -1.2`,
    face: `M-1.6 0.4l0.1 0.1M1.6 0.2l0.1 0.1` + soft([[-1.6, 2.2], [0, 3], [1.8, 2.1]]),
    arm: soft([[3.4, 7], [8.4, 3.4], [10.2, -2]]) + `M10.2 -2L8.8 -4.2M10.2 -2L10.4 -4.8M10.2 -2L12 -4`,
  };
}

// ─── Speech ─────────────────────────────────────────────────────────────

/** A hand-drawn speech bubble `w` by `h`, its corner at the origin, with a tail down to `tail` (x along its foot). */
export function bubble(seed: string, w: number, h: number, tail: number): string {
  const r = createRng(hashSeed(seed));
  const j = () => spread(r, 0.5);
  const c = Math.min(5, h / 2.4);
  const t = Math.min(Math.max(tail, c + 4), w - c - 8);
  return (
    `M${r1(c + j())} ${r1(j())}` +
    `L${r1(w - c)} ${r1(j())}Q${r1(w + j())} 0 ${r1(w + j())} ${r1(c)}` +
    `L${r1(w + j())} ${r1(h - c)}Q${r1(w)} ${r1(h + j())} ${r1(w - c)} ${r1(h + j())}` +
    `L${r1(t + 7)} ${r1(h + j() * 0.5)}L${r1(t + 1 + j())} ${r1(h + 7.5)}L${r1(t - 1)} ${r1(h + 0.4)}` +
    `L${r1(c)} ${r1(h + j())}Q0 ${r1(h)} ${r1(j())} ${r1(h - c)}` +
    `L${r1(j())} ${r1(c)}Q${r1(j())} 0 ${r1(c + j())} ${r1(j())}`
  );
}

/** How wide to make a bubble for words, in units. */
export const textWidth = (words: string, size: number) => words.length * size * 0.52 + 4;
