// The last drawing on the page: a snowy hillside with pines, a bare tree, a
// trail, and a camp at the end of it. Wide, so it runs the whole width of the
// page and fades up into it. What lives in it (the hikers on the trail, the
// fire, the birds) is in components/art/life; this has the places they go.

import { clamp, createRng, curve, hashSeed, noise, sample, smoothstep, track, visibleRuns, type Piece, type Pt, type Scene } from "./kit.ts";
import { bareTree, contours, forest, hatchField, logs, pine, rock, shade, skyline, streaks, tent, tufts } from "./nature.ts";
import { footerBox } from "./boxes.ts";

const wob = noise(hashSeed("footer-front"));
/** The hill in front: a long slope falling from the left, then meadow. */
export const front = (x: number) => 192 + 176 * Math.pow(smoothstep(0, 980, x), 0.95) + wob(x * 0.006) * 8 + Math.sin(x * 0.0065) * 5 * smoothstep(700, 1100, x);
/** The trail along it, where the hikers walk (y of its middle at x). */
export const trailY = (x: number) => front(x) + 22 + (x < 700 ? 18 : 8) - Math.sin(x * 0.012) * 3;

/** Where things are at the camp, and how far along the trail people go. */
export const camp = { fire: 1252, tent: 1372, tentW: 84, tentH: 52, trailFrom: 424, trailTo: 1196 } as const;

/** The tall snowy pines on the high shoulder of the slope, tallest at the edge. */
export const bigPines: { cx: number; h: number; fat?: number; lean?: number }[] = [
  { cx: 28, h: 238, fat: 1.15, lean: 4 },
  { cx: 94, h: 196, fat: 1.1 },
  { cx: 150, h: 252, fat: 1.15, lean: -3 },
  { cx: 214, h: 170, fat: 1.05 },
  { cx: 262, h: 128, fat: 1 },
  { cx: 316, h: 96, fat: 1 },
  { cx: 366, h: 66, fat: 0.95 },
];
export const pineBase = (cx: number) => front(cx) + 14;

export function footerScene(): Scene {
  const pieces: Piece[] = [];
  const add = (...p: Piece[][]) => pieces.push(...p.flat());
  /** Ink under a ridge: heaviest just beneath it, on the side that falls away from the light, gone by `reach`. */
  const under = (ridgeAt: (x: number) => number, reach: number) => (x: number, y: number) => {
    const depth = y - ridgeAt(x);
    const slope = (ridgeAt(x + 6) - ridgeAt(x - 6)) / 12;
    return Math.pow(clamp(1 - depth / reach), 1.3) * (0.25 + 0.75 * smoothstep(0.0, 0.35, slope));
  };

  const frontLine: Pt[] = sample(-20, 1620, 12, front);
  // The wooded ridge behind it, and the far hills.
  const wood = noise(hashSeed("footer-wood"));
  const ridge = (x: number) => 286 + wood(x * 0.0045) * 15 + Math.sin(x * 0.0052 + 0.5) * 11;
  const ridgeLine: Pt[] = sample(420, 1620, 10, ridge);
  const far = skyline("footer-far", 380, 1620, 262, [
    { x: 640, h: 64, wl: 190, wr: 150, pl: 1, pr: 1.1 },
    { x: 1010, h: 50, wl: 170, wr: 190, pl: 1.1, pr: 1 },
    { x: 1390, h: 82, wl: 180, wr: 200, pl: 1, pr: 1.15 },
  ], 6, [10, 28]);
  const hideFar = (x: number) => Math.min(ridge(x), front(x));
  const roll = noise(hashSeed("footer-roll"));
  const hills = (x: number) => 331 + roll(x * 0.004) * 16 + Math.sin(x * 0.0064 + 0.6) * 12;
  const hillsLine: Pt[] = sample(820, 1620, 10, hills);

  // ── The outlines the picture is built on, one after another under the pen. ──
  const pen = track(260, 1.15);
  add(
    [pen.lay({ d: curve(frontLine), w: 1.15, at: 0, dur: 0, how: "draw", z: 1, cls: "lead" })],
    visibleRuns(ridgeLine, front, 4).map((run) => pen.lay({ d: curve(run), w: 0.9, at: 0, dur: 0, how: "draw", z: 1, cls: "lead" })),
    visibleRuns(hillsLine, front, 4).map((run) => pen.lay({ d: curve(run), w: 0.95, at: 0, dur: 0, how: "draw", z: 1, cls: "lead" })),
  );

  // Sky: long strokes laid across, a band at a time.
  add(streaks("footer-sky", { x0: 0, x1: 1600, y0: 22, y1: 150, rows: 8, z: 0, at: 500, o: 0.4, len: [36, 170] }));

  // The far hills, light.
  add(
    visibleRuns(far.line, hideFar).map((run, i) => ({ d: curve(run), w: 0.75, o: 0.65, at: 700 + i * 220, dur: 900, how: "draw" as const, z: 0 as const })),
    shade({ seed: "footer-far-h", y: far.y, x0: 380, x1: 1620, reach: 40, gap: 3.4, lit: 0.35, hide: hideFar, w: 0.55, o: 0.6, z: 0, from: 800, to: 1900, chunks: 10 }),
  );

  // The wooded ridge: a dense stand of pines on its top, snowy hillsides under it.
  add(
    forest({ seed: "footer-wood-trees", x0: 460, x1: 1600, ground: (x) => ridge(x) + 8, size: [15, 38], density: 11, z: 1, at: 1300, chunks: 12, ms: 120, w: 0.75 }),
    hatchField("footer-wood-h", { x0: 430, x1: 1620, y0: 250, y1: 372, angle: 64, gap: 2.1, tone: under(ridge, 58), inside: (x, y) => y > ridge(x) + 6 && y < front(x) - 2, len: [5, 15], z: 1, from: 1400, to: 2700, chunks: 14, w: 0.6 }),
    contours("footer-wood-slope", { y: ridge, x0: 430, x1: 1600, bottom: 372, gap: 6, ink: (x, d) => clamp(0.1 + d / 240, 0, 0.6), hide: front, z: 1, from: 1500, to: 2600, groups: 6, w: 0.62, o: 0.8 }),
  );

  // Soft hills between the wood and the meadow, on the right.
  add(
    hatchField("footer-hills-h", { x0: 820, x1: 1620, y0: 290, y1: 380, angle: 64, gap: 2.1, tone: under(hills, 44), inside: (x, y) => y > hills(x) + 5 && y < front(x) - 2, len: [5, 14], z: 1, from: 2000, to: 3000, chunks: 10, w: 0.6 }),
    forest({ seed: "footer-hills-trees", x0: 900, x1: 1600, ground: (x) => hills(x) + 4, size: [7, 15], density: 3.5, z: 1, at: 2300, chunks: 6, ms: 120, w: 0.7 }),
  );

  // The big slope on the left, worked over with the pen down toward the corner.
  const dark = (x: number, y: number) => clamp(0.1 + (y - front(x)) / 150 - x / 1250 + noise(hashSeed("footer-dark"))(x * 0.01 + y * 0.004) * 0.25, 0, 1);
  add(
    contours("footer-front-slope", { y: front, x0: 0, x1: 1600, bottom: 440, gap: 3.8, ink: (x, d) => clamp(0.2 + d / 100 - x / 1500, 0.05, 0.98), z: 1, from: 900, to: 3000, groups: 12, w: 0.72 }),
    hatchField("footer-cross", { x0: 0, x1: 1050, y0: 150, y1: 440, angle: 58, gap: 2.3, tone: (x, y) => Math.max(0, dark(x, y) - 0.15) * 1.1, inside: (x, y) => y > front(x) + 5, len: [8, 22], z: 1, from: 1100, to: 3000, chunks: 14, w: 0.62 }),
    hatchField("footer-cross-2", { x0: 0, x1: 640, y0: 200, y1: 440, angle: 22, gap: 2.8, tone: (x, y) => Math.max(0, dark(x, y) - 0.5) * 1.6, inside: (x, y) => y > front(x) + 20, len: [10, 28], z: 1, from: 1500, to: 3000, chunks: 8, w: 0.6 }),
  );

  // The trail, climbing back toward the pines, and the camp at the end of it.
  const trail: Pt[] = sample(160, 1340, 20, trailY);
  const trailB: Pt[] = trail.map(([x, y]) => [x + 3, y + 5.5]);
  add([
    { d: curve(trail), w: 0.9, o: 0.85, at: 2300, dur: 1000, how: "draw", z: 2 },
    { d: curve(trailB), w: 0.7, o: 0.65, at: 2500, dur: 1000, how: "draw", z: 2 },
  ]);
  const campY = (x: number) => trailY(x) + 4;
  add(tent(camp.tent, campY(camp.tent), camp.tentW, camp.tentH, 2, 3200), logs(camp.fire, campY(camp.fire) + 1, 2, 3500));

  // Snowy pines on the slope's high shoulder, tallest at the edge. Each is a group, to sway on its own.
  const big = createRng(hashSeed("footer-pines"));
  bigPines.forEach((t, i) => add(pine(big, { ...t, base: pineBase(t.cx), snow: true, hatch: 1.7, z: 2, at: 1200 + i * 170, w: 1.15, g: `tree t${i}` })));

  // A bare tree, boulders and grass.
  add(bareTree(createRng(hashSeed("footer-dead")), 640, front(640) + 26, 118, 2, 2000, 1.15));
  const stones = createRng(hashSeed("footer-stones"));
  const rocks: [number, number, number, number][] = [[430, 54, 30, 13], [520, 78, 22, 9], [760, 68, 34, 14], [820, 74, 18, 8], [1120, 60, 26, 10], [1020, 70, 20, 8], [300, 70, 24, 10], [210, 98, 36, 15], [90, 120, 28, 12]];
  rocks.forEach(([x, dy, w, h], i) => add(rock(stones, x, front(x) + dy, w, h, 2, 2500 + i * 90)));
  add(
    tufts("footer-grass-a", { x0: 0, x1: 700, ground: (x) => front(x) + 70, count: 20, h: [6, 16], z: 2, at: 3000 }),
    tufts("footer-grass-b", { x0: 700, x1: 1600, ground: (x) => front(x) + 50, count: 22, h: [6, 14], z: 2, at: 3100 }),
    contours("footer-meadow", { y: (x) => front(x) + 30, x0: 700, x1: 1600, bottom: 436, gap: 7, ink: (x, d) => clamp(0.18 + d / 150, 0, 0.5), z: 2, from: 2800, to: 3500, groups: 4, w: 0.65, o: 0.8 }),
  );
  return { box: footerBox, pieces };
}
