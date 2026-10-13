// A small scene for the panel that shows the other side of the page: a lake
// under two peaks and a few pines, with both a moon and stars (marked for the
// night) and a sun and clouds (marked for the day). The panel shows the side
// the page is not on, in that side's ink.

import { clamp, createRng, curve, hashSeed, lerp, poly, smoothstep, type Piece, type Scene } from "./kit.ts";
import { cloud, echoLines, forest, moon, pine, shade, shoreShadow, skyline, spurs, stars, sun, tufts, water } from "./nature.ts";
import { sideBox } from "./boxes.ts";

export function sideScene(): Scene {
  const pieces: Piece[] = [];
  const add = (...p: Piece[][]) => pieces.push(...p.flat());
  const main = skyline("night-main", -20, 600, 300, [
    { x: 190, h: 196, wl: 200, wr: 230, pl: 1.1, pr: 1 },
    { x: 410, h: 140, wl: 130, wr: 200, pl: 1.15, pr: 1.05 },
  ], 13, [7, 18]);
  const treeline = (x: number) => 286 + 6 * Math.sin(x * 0.02);
  add(
    [{ d: poly(main.line), w: 1.1, at: 300, dur: 1500, how: "draw", z: 0 }],
    shade({ seed: "night-h", y: main.y, x0: -10, x1: 590, reach: 120, gap: 1.8, floor: (x) => treeline(x) + 3, lit: 0.2, z: 0, from: 500, to: 1900, chunks: 10 }),
    spurs("night-s", main.line, main.y, { count: 5, reach: 100, floor: (x) => treeline(x) - 6, z: 0, from: 700, to: 1900 }),
    echoLines("night-e", main.line, main.y, 40, 520, { count: 2, start: 13, gap: 15, z: 0, at: 900 }),
    moon(450, 78, 24, 0, 1400),
    stars("night-stars", { x0: 20, x1: 540, y0: 12, y1: 170, count: 30, z: 0, at: 1500 }),
    sun(450, 82, 20, 0, 1400),
    cloud("side-cloud-a", 150, 92, 112, 26, 0, 1500).map((p) => ({ ...p, only: "day" as const })),
    cloud("side-cloud-b", 500, 150, 84, 20, 0, 1700).map((p) => ({ ...p, only: "day" as const })),
    forest({ seed: "night-forest", x0: -10, x1: 570, ground: (x) => treeline(x) + 10, size: [8, 22], density: 9, z: 1, at: 1500, chunks: 6, ms: 160 }),
    water("night-water", { x0: 20, x1: 540, y0: 300, y1: 370, rows: 16, edge: (y) => [lerp(40, 10, clamp((y - 300) / 70)), lerp(520, 550, clamp((y - 300) / 70))], z: 1, at: 1900 }),
    shoreShadow("night-shadow", { x0: 60, x1: 500, y: 294, depth: 14, z: 1, at: 2100 }),
  );
  // The moon on the water: short upright strokes under it.
  const r = createRng(hashSeed("night-glint"));
  const glints: Piece[] = [];
  for (let i = 0; i < 9; i++) {
    const y = 309 + i * 6;
    const half = (1 - smoothstep(0, 60, i * 6.5)) * 26 + 5;
    glints.push({ d: curve([[450 - half, y], [450 + half * (0.3 + r() * 0.5), y + (r() - 0.5)], [450 + half, y]]), w: 0.9, o: 0.9, at: 2300 + i * 90, dur: 260, how: "draw", z: 1 });
  }
  add(glints);
  const pr = createRng(hashSeed("night-pines"));
  [[38, 350, 196], [92, 322, 118], [522, 354, 150], [484, 324, 92]].forEach(([cx, base, h], i) => add(pine(pr, { cx, base, h, fat: 1.05, z: 2, at: 2000 + i * 200, w: 1.1, hatch: 1 })));
  add(tufts("night-grass", { x0: 20, x1: 540, ground: (x) => 380 + 4 * Math.sin(x * 0.04), count: 16, h: [6, 14], z: 2, at: 2600 }));
  return { box: sideBox, pieces };
}
