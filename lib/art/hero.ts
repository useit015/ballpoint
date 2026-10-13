// The front page's drawing: a lake in the mountains, pines either side. The
// pen lays down the outlines first, one after another (the strokes marked
// "lead", which a pen drawn over them follows), and everything else is
// worked in around it: the shade, the trees, the water, the grass. What
// lives in it (the sun, the birds, the boat) is in components/art/life.

import { clamp, createRng, curve, hashSeed, lerp, noise, poly, smoothstep, track, visibleRuns, type Piece, type Scene } from "./kit.ts";
import { cloud, echoLines, forest, island, mirror, moon, pine, rock, shade, shoreShadow, skyline, spurs, stars, streaks, sun, tufts, water } from "./nature.ts";
import { heroBox, sky, tallPines } from "./boxes.ts";

export function heroScene(): Scene {
  const pieces: Piece[] = [];
  const add = (...p: Piece[][]) => pieces.push(...p.flat());

  // ── The big peaks. ──
  const main = skyline("hero-main", -30, 660, 340, [
    { x: 292, h: 268, wl: 260, wr: 300, pl: 1.12, pr: 0.98 },
    { x: 108, h: 168, wl: 150, wr: 160, pl: 1.05, pr: 1.2 },
    { x: 478, h: 212, wl: 130, wr: 200, pl: 1.2, pr: 1.05 },
  ], 15, [7, 22]);
  const right = skyline("hero-right", 470, 840, 342, [
    { x: 668, h: 196, wl: 190, wr: 180, pl: 1.1, pr: 1.05 },
    { x: 786, h: 150, wl: 90, wr: 90, pl: 1.1, pr: 1.1 },
  ], 12, [7, 20]);
  const treeline = (x: number) => 322 + 14 * Math.sin(x * 0.011) + 9 * Math.sin(x * 0.037 + 2);

  // ── The far range, faint, along the horizon. ──
  const far = skyline("hero-far", -30, 830, 318, [
    { x: 60, h: 78, wl: 150, wr: 150, pl: 1, pr: 1.1 },
    { x: 400, h: 62, wl: 170, wr: 160, pl: 1.1, pr: 1 },
    { x: 760, h: 92, wl: 170, wr: 150, pl: 1, pr: 1.1 },
  ], 7, [10, 26]);
  const hideFar = (x: number) => Math.min(main.y(x), right.y(x));
  const pen = track(300, 0.95);
  add(
    visibleRuns(main.line, right.y, 2).map((run) => pen.lay({ d: poly(run), w: 1.2, at: 0, dur: 0, how: "draw", z: 0, cls: "lead" })),
    [pen.lay({ d: poly(right.line), w: 1.15, at: 0, dur: 0, how: "draw", z: 0, cls: "lead" })],
    visibleRuns(far.line, hideFar).map((run) => pen.lay({ d: curve(run), w: 0.75, o: 0.6, at: 0, dur: 0, how: "draw", z: 0, cls: "lead" })),
  );
  add(
    shade({ seed: "hero-far-h", y: far.y, x0: -20, x1: 820, reach: 36, gap: 3.2, lit: 0.3, hide: hideFar, w: 0.55, o: 0.6, z: 0, from: 1700, to: 2700, chunks: 8 }),
    shade({ seed: "hero-main-h", y: main.y, x0: -20, x1: 650, reach: 150, gap: 1.75, slant: 0.3, floor: (x) => treeline(x) + 4, hide: right.y, lit: 0.22, z: 0, from: 600, to: 2500, chunks: 14 }),
    shade({ seed: "hero-right-h", y: right.y, x0: 480, x1: 830, reach: 130, gap: 1.75, slant: 0.3, floor: (x) => treeline(x) + 6, lit: 0.22, z: 0, from: 1500, to: 2500, chunks: 8 }),
    spurs("hero-main-s", main.line, main.y, { count: 7, reach: 120, floor: (x) => treeline(x) - 8, hide: right.y, z: 0, from: 800, to: 2400 }),
    spurs("hero-right-s", right.line, right.y, { count: 4, reach: 100, floor: (x) => treeline(x) - 8, z: 0, from: 1700, to: 2500 }),
    echoLines("hero-main-e", main.line, main.y, 40, 600, { count: 3, start: 16, gap: 17, z: 0, at: 1200 }),
    echoLines("hero-right-e", right.line, right.y, 500, 820, { count: 2, start: 14, gap: 16, z: 0, at: 2000 }),
  );

  // ── Trees along the far shore: a band of small ones, then single pines. ──
  const shore = (x: number) => 345 + 4 * Math.sin(x * 0.03);
  const edge = (y: number): [number, number] => {
    const t = clamp((y - 348) / (456 - 348));
    return [lerp(168, 56, t) + 10 * Math.sin(y * 0.1), lerp(624, 748, t) + 8 * Math.sin(y * 0.13 + 1)];
  };
  add(
    forest({ seed: "hero-slopes", x0: -20, x1: 820, ground: (x) => treeline(x) + 16, size: [6, 13], density: 11, z: 1, at: 1500, chunks: 7, ms: 150, w: 0.7 }),
    forest({ seed: "hero-shore", x0: 120, x1: 690, ground: shore, size: [13, 30], density: 7.5, z: 1, at: 1800, chunks: 6, ms: 150 }),
  );
  const r = createRng(hashSeed("hero-pines"));
  const mid = [
    [196, 352, 52], [232, 349, 38], [268, 351, 30], [330, 347, 26], [412, 346, 34], [474, 348, 28], [548, 350, 44], [586, 352, 56], [620, 354, 36],
  ] as const;
  mid.forEach(([x, base, h], i) => add(pine(r, { cx: x, base, h, z: 1, at: 2000 + i * 90, w: 0.95, hatch: 0.8 })));

  // ── The water. ──
  add(
    water("hero-water", { x0: 60, x1: 750, y0: 358, y1: 452, rows: 26, edge, avoid: [[402, 378, 488, 404]], z: 1, at: 2100, rowMs: 46 }),
    shoreShadow("hero-shadow", { x0: 180, x1: 630, y: 349, depth: 22, z: 1, at: 2400 }),
    mirror("hero-mirror", { x0: 190, x1: 640, y: 352, depth: 34, dark: (x) => 0.25 + 0.75 * smoothstep(130, 300, x) * (1 - smoothstep(430, 620, x)), z: 1, at: 2500 }),
    island("hero-island", 446, 398, 78, 1, 2700),
    streaks("hero-mist", { x0: 90, x1: 730, y0: 324, y1: 342, rows: 3, z: 1, at: 2200, o: 0.32, len: [60, 170] }),
  );

  // ── The banks, and the tall pines either side. ──
  const bankL = (x: number) => 440 - 60 * smoothstep(0, 130, x) + 6 * Math.sin(x * 0.05);
  const bankR = (x: number) => 440 - 60 * (1 - smoothstep(660, 800, x)) + 6 * Math.sin(x * 0.05);
  add(
    forest({ seed: "hero-bank-l", x0: 0, x1: 200, ground: (x) => bankL(x) - 10, size: [16, 56], density: 8, taper: (x) => 0.5 + 0.5 * (1 - smoothstep(0, 220, x)), z: 2, at: 2200, chunks: 3, ms: 150 }),
    forest({ seed: "hero-bank-r", x0: 620, x1: 800, ground: (x) => bankR(x) - 10, size: [16, 50], density: 8, taper: (x) => 0.5 + 0.5 * smoothstep(620, 800, x), z: 2, at: 2300, chunks: 3, ms: 150 }),
  );
  const big = createRng(hashSeed("hero-big"));
  tallPines.forEach((t, i) => add(pine(big, { ...t, z: 2, at: 2300 + i * 150, w: 1.2, hatch: 1.1, g: `tree t${i}` })));

  // ── Foreground: grass, reeds, a few stones. ──
  add(
    tufts("hero-reeds-l", { x0: 70, x1: 260, ground: (x) => 452 + 8 * Math.sin(x * 0.07), count: 16, h: [10, 30], z: 2, at: 3200, reeds: true }),
    tufts("hero-reeds-r", { x0: 560, x1: 720, ground: (x) => 456 + 8 * Math.sin(x * 0.06), count: 14, h: [10, 28], z: 2, at: 3300, reeds: true }),
    tufts("hero-grass", { x0: 20, x1: 790, ground: (x) => 486 + 10 * Math.sin(x * 0.03), count: 26, h: [6, 16], z: 2, at: 3300 }),
  );
  const stones = createRng(hashSeed("hero-stones"));
  add(rock(stones, 214, 462, 26, 11, 2, 3500), rock(stones, 640, 470, 34, 13, 2, 3550), rock(stones, 330, 488, 20, 8, 2, 3600));

  // ── The sky: wisps and clouds by day, a moon and stars at night. ──
  add(
    streaks("hero-wisps", { x0: 380, x1: 790, y0: 40, y1: 84, rows: 3, z: 0, at: 1900, o: 0.45, len: [30, 100] }),
    moon(sky.x, sky.y - 2, 20, 0, 2200),
    sun(sky.x, sky.y, 15, 0, 2200),
    cloud("hero-cloud-a", 126, 134, 128, 30, 0, 1600, "cloud a"),
    cloud("hero-cloud-b", 500, 52, 104, 26, 0, 2000, "cloud b"),
    stars("hero-stars", { x0: 40, x1: 780, y0: 12, y1: 190, count: 26, z: 0, at: 2600 }),
  );

  void noise;
  return { box: heroBox, pieces };
}
