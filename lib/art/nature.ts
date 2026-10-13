// Things a ballpoint draws outdoors: mountains hatched down from their
// ridges, pines, forests, still water, grass, rocks, birds and walkers.
// Each returns pieces (see kit.ts) for a scene to arrange and time.

import { clamp, crags, createRng, curve, f, fbm, hashSeed, heightAt, lerp, noise, poly, polys, pulls, ringPts, sample, smoothstep, spread, type Piece, type Pt, type Rng } from "./kit.ts";

type Depth = 0 | 1 | 2;

// ─── Mountains ──────────────────────────────────────────────────────────

export type Peak = { x: number; h: number; wl: number; wr: number; pl?: number; pr?: number };

/** A mountain range's skyline: heights from `peaks`, roughened, as straight crags. */
export function skyline(seed: string, x0: number, x1: number, base: number, peaks: Peak[], rough = 14, crag: [number, number] = [6, 20]) {
  const n1 = noise(hashSeed(`${seed}:a`));
  const n2 = noise(hashSeed(`${seed}:b`));
  const maxH = Math.max(...peaks.map((p) => p.h));
  const height = (x: number) => {
    let h = 0;
    for (const p of peaks) {
      const d = x - p.x;
      const u = clamp(1 - Math.abs(d) / (d < 0 ? p.wl : p.wr));
      h = Math.max(h, p.h * Math.pow(u, d < 0 ? (p.pl ?? 1.2) : (p.pr ?? 1.2)));
    }
    const hf = h / maxH;
    const ridged = 1 - Math.abs(fbm(n1, x * 0.04, 4));
    const wobble = fbm(n2, x * 0.014, 3);
    return base - (h + (ridged - 0.62) * rough * 1.5 * smoothstep(0.06, 0.45, hf) + wobble * rough * 0.7 * smoothstep(0.02, 0.35, hf));
  };
  const r = createRng(hashSeed(`${seed}:crags`));
  const line = crags(r, x0, x1, height, crag[0], crag[1]);
  return { line, y: (x: number) => heightAt(line, x), noise: n2 };
}

type Shade = {
  seed: string;
  /** The ridge the shade hangs from. */
  y: (x: number) => number;
  x0: number;
  x1: number;
  /** How far down the ink reaches before the paper takes over. */
  reach: number;
  /** Space between strokes. */
  gap: number;
  /** Lean of each stroke: x travelled per y. */
  slant?: number;
  /** A line the strokes stop at (a treeline, a haze). */
  floor?: (x: number) => number;
  /** The ridge of whatever stands in front: strokes behind it are left out. */
  hide?: (x: number) => number;
  /** Ink on the side that faces the light, against the shaded side's. */
  lit?: number;
  /** How broken the faces are, 0 to 1. */
  facets?: number;
  /** How fast the ink thins with depth (higher is faster). */
  falloff?: number;
  /** Scales the tone at a point: where the ink presses harder. */
  boost?: (x: number, depth: number) => number;
  w?: number;
  o?: number;
  z: Depth;
  /** When the pen reaches x0 and x1: the shade follows it across. */
  from: number;
  to: number;
  /** Chunks the shade inks in as, left to right. */
  chunks?: number;
};

/**
 * Engraver's shading hung from a ridge. A tone field says how dark the
 * mountain is at each point: darkest under the ridge on the side that
 * faces away from the light, broken into facets, fading with depth. Each
 * column of pen strokes runs while that tone beats a threshold of its own,
 * so strokes start and stop at different depths, and a gradient of density
 * comes out of lines of one weight. A second set, leaning the other way,
 * goes over the darkest parts.
 */
export function shade(o: Shade): Piece[] {
  const r = createRng(hashSeed(o.seed));
  const nz = noise(hashSeed(`${o.seed}:n`));
  const nf = noise(hashSeed(`${o.seed}:f`));
  const ns = noise(hashSeed(`${o.seed}:s`));
  const slant = o.slant ?? 0.3;
  const lit = o.lit ?? 0.15;
  const facets = o.facets ?? 0.65;
  const slope = (x: number) => (o.y(x + 6) - o.y(x - 6)) / 12;
  const chunks = o.chunks ?? 6;
  const span = (o.x1 - o.x0) / chunks;
  const out: Piece[] = [];
  for (let c = 0; c < chunks; c++) {
    const strokes: Pt[][] = [];
    const xa = o.x0 + c * span;
    for (let x = xa + r() * o.gap; x < xa + span; x += o.gap * (0.75 + r() * 0.5)) {
      const sl = slope(x);
      const away = smoothstep(0.02, 0.55, sl);
      const y0 = o.y(x);
      const floor = o.floor?.(x) ?? y0 + o.reach;
      const limit = Math.min(floor - y0, o.reach);
      if (limit < 4) continue;
      const u = Math.pow(r(), 0.9) * 0.8;
      let from = -1;
      // A run of ink is laid down as short pulls with the pen lifted between.
      // Each pull leans by the face it is on, from where the column's line
      // would be, so a column never jumps sideways between pulls.
      const cut = (d0: number, d1: number, back: boolean) => {
        const sign = back ? -0.8 : 1;
        let d = d0;
        while (d < d1 - 5) {
          const len = Math.min(d1 - d, 10 + r() * 26);
          const face = smoothstep(-0.12, 0.12, fbm(nf, x * 0.03 - d * 0.018 + 4, 2));
          const lean = back ? -slant * 0.8 : slant * (0.15 + 0.95 * face);
          const ax = x + sign * slant * 0.6 * d + spread(r, 0.4);
          const a: Pt = [ax, y0 + d + 1];
          const b: Pt = [ax + lean * len + spread(r, 0.5), y0 + d + len + 1];
          if (!o.hide || (b[1] < o.hide(b[0]) - 1 && a[1] < o.hide(a[0]) - 1)) strokes.push([a, b]);
          d += len + 1 + r() * 3.2;
        }
      };
      for (let d = 1; d <= limit; d += 3) {
        const face = smoothstep(-0.12, 0.12, fbm(nf, x * 0.03 - d * 0.018 + 4, 2));
        const dark = away * (1 - facets + facets * face);
        const falloff = Math.pow(Math.max(0, 1 - d / (o.reach * 1.02)), o.falloff ?? 1.1);
        const grain = 0.7 + 0.3 * (0.5 + 0.5 * nz(x * 0.2 + d * 0.05));
        const tone = (dark * 1.3 + (1 - away) * lit * (0.4 + 0.6 * (0.5 + 0.5 * ns(x * 0.05 + d * 0.01)))) * falloff * grain * (o.boost ? o.boost(x, d) : 1);
        const on = tone > u;
        if (on && from < 0) from = d;
        if (!on && from >= 0) {
          cut(from, d, false);
          from = -1;
        }
      }
      if (from >= 0) cut(from, limit, false);
      // The cross strokes, only where it is darkest.
      if (away > 0.6 && r() < 0.8) {
        const d0 = 2 + r() * 8;
        const len = o.reach * (0.22 + r() * 0.3) * Math.pow(away, 2);
        if (y0 + d0 + len < floor) cut(d0, d0 + len, true);
      }
    }
    if (!strokes.length) continue;
    const t = (c + 0.5) / chunks;
    out.push({ d: pulls(strokes), w: o.w ?? 0.7, o: o.o ?? 0.92, at: lerp(o.from, o.to, t) - 80, dur: Math.max(200, ((o.to - o.from) / chunks) * 1.6), how: "sweep", z: o.z });
  }
  return out;
}

/**
 * Spurs: the ridges that run down a mountain's face from its crags. Each
 * starts at a high point of the skyline and wanders downhill, a pulled line
 * that gives the white faces their form.
 */
export function spurs(seed: string, line: readonly Pt[], y: (x: number) => number, o: { count: number; reach: number; floor?: (x: number) => number; hide?: (x: number) => number; z: Depth; from: number; to: number; w?: number }): Piece[] {
  const r = createRng(hashSeed(seed));
  const nz = noise(hashSeed(`${seed}:n`));
  // The peaks, highest first.
  const peaks: Pt[] = [];
  for (let i = 1; i < line.length - 1; i++) if (line[i][1] < line[i - 1][1] && line[i][1] < line[i + 1][1]) peaks.push(line[i]);
  peaks.sort((a, b) => a[1] - b[1]);
  const x0 = line[0][0];
  const x1 = line[line.length - 1][0];
  const out: Piece[] = [];
  for (const [px, py] of peaks.slice(0, o.count)) {
    const dir = r() < 0.5 ? -1 : 1;
    const len = o.reach * (0.45 + r() * 0.55);
    const pts: Pt[] = [];
    let x = px;
    let yy = py + 3;
    const floor = o.floor?.(px) ?? py + len;
    for (let d = 0; d < len && yy < floor - 6; d += 7) {
      x += dir * (1.4 + r() * 2.2) + nz(d * 0.05 + px) * 2.2;
      yy += 6 + r() * 3;
      if (o.hide && yy > o.hide(x) - 2) break;
      pts.push([x, yy]);
    }
    if (pts.length < 4) continue;
    out.push({ d: curve([[px, py + 2], ...pts]), w: o.w ?? 0.8, o: 0.8, at: lerp(o.from, o.to, (px - x0) / (x1 - x0)), dur: 300 + pts.length * 40, how: "draw", z: o.z });
  }
  void y;
  return out;
}

/**
 * The flowing lines a pen lays down a hillside: rows that follow the ridge's
 * shape, each a little further down, broken into runs where the ink thins.
 * `ink(x, depth)` is how likely a stretch is to be drawn, 0 to 1. Rows are
 * inked in a group at a time, from the ridge down.
 */
export function contours(
  seed: string,
  o: { y: (x: number) => number; x0: number; x1: number; bottom: number; gap: number; ink: (x: number, depth: number) => number; hide?: (x: number) => number; z: Depth; from: number; to: number; groups?: number; w?: number; o?: number },
): Piece[] {
  const r = createRng(hashSeed(seed));
  const nz = noise(hashSeed(`${seed}:n`));
  const gate = noise(hashSeed(`${seed}:g`));
  const rows: Pt[][][] = [];
  for (let k = 1; k < 90; k++) {
    const depth = k * o.gap * (1 + 0.01 * k);
    const runs: Pt[][] = [];
    let run: Pt[] = [];
    let any = false;
    const flush = () => {
      if (run.length > 2) runs.push(run);
      run = [];
    };
    for (let x = o.x0; x <= o.x1; x += 5) {
      const yy = o.y(x) + depth + nz(x * 0.012 + k * 0.37) * 3 * (1 + k * 0.03) + nz(x * 0.06 + k) * 1;
      if (yy > o.bottom || (o.hide && yy > o.hide(x) - 2)) {
        flush();
        continue;
      }
      any = true;
      const on = 0.5 + 0.5 * gate(x * 0.035 + k * 5.7) + (r() - 0.5) * 0.12 < o.ink(x, depth);
      if (on) run.push([x, yy]);
      else flush();
    }
    flush();
    rows.push(runs);
    if (!any && k > 3) break;
  }
  const groups = o.groups ?? 8;
  const per = Math.ceil(rows.length / groups);
  const out: Piece[] = [];
  for (let g = 0; g < groups; g++) {
    const d = rows
      .slice(g * per, (g + 1) * per)
      .flat()
      .map(curve)
      .join("");
    if (d) out.push({ d, w: o.w ?? 0.7, o: o.o ?? 0.9, at: lerp(o.from, o.to, g / Math.max(1, groups - 1)), dur: Math.max(260, ((o.to - o.from) / groups) * 1.5), how: "sweep", down: true, z: o.z });
  }
  return out;
}

/**
 * Hatching laid over an area at one angle, as short pulls: each line of the
 * hatch is inked where `tone(x, y)` (0 to 1) beats a throw of the dice, so
 * the ink gathers in the dark places and thins to nothing in the light.
 * `angle` is in degrees clockwise from the x axis (y runs down).
 */
export function hatchField(
  seed: string,
  o: { x0: number; x1: number; y0: number; y1: number; angle: number; gap: number; tone: (x: number, y: number) => number; inside?: (x: number, y: number) => boolean; len?: [number, number]; z: Depth; from: number; to: number; chunks?: number; w?: number; o?: number },
): Piece[] {
  const r = createRng(hashSeed(seed));
  const a = (o.angle * Math.PI) / 180;
  const dir: Pt = [Math.cos(a), Math.sin(a)];
  const perp: Pt = [-dir[1], dir[0]];
  const corners: Pt[] = [[o.x0, o.y0], [o.x1, o.y0], [o.x1, o.y1], [o.x0, o.y1]];
  const js = corners.map(([x, y]) => x * perp[0] + y * perp[1]);
  const ts = corners.map(([x, y]) => x * dir[0] + y * dir[1]);
  const [jmin, jmax] = [Math.min(...js), Math.max(...js)];
  const [tmin, tmax] = [Math.min(...ts), Math.max(...ts)];
  const [lmin, lmax] = o.len ?? [8, 26];
  const chunks = o.chunks ?? 10;
  const bins: Pt[][][] = Array.from({ length: chunks }, () => []);
  const ok = (x: number, y: number) => x >= o.x0 && x <= o.x1 && y >= o.y0 && y <= o.y1 && (o.inside?.(x, y) ?? true);
  for (let j = jmin; j <= jmax; j += o.gap * (0.8 + r() * 0.4)) {
    let t = tmin + r() * lmax;
    while (t < tmax) {
      const px = dir[0] * t + perp[0] * j;
      const py = dir[1] * t + perp[1] * j;
      if (!ok(px, py)) {
        t += 4;
        continue;
      }
      if (o.tone(px, py) <= r() * 0.95) {
        t += 3 + r() * 4;
        continue;
      }
      let len = lmin + r() * (lmax - lmin);
      // Stop where the area ends.
      while (len > 3 && !ok(px + dir[0] * len, py + dir[1] * len)) len -= 3;
      if (len > 3) {
        const bin = Math.min(chunks - 1, Math.floor(((px - o.x0) / (o.x1 - o.x0)) * chunks));
        bins[bin].push([[px, py], [px + dir[0] * len + spread(r, 0.4), py + dir[1] * len + spread(r, 0.4)]]);
      }
      t += len + 1.5 + r() * 3;
    }
  }
  return bins.flatMap((lines, i) => (lines.length ? [{ d: pulls(lines), w: o.w ?? 0.65, o: o.o ?? 0.9, at: lerp(o.from, o.to, i / Math.max(1, chunks - 1)), dur: Math.max(220, ((o.to - o.from) / chunks) * 1.5), how: "sweep" as const, z: o.z }] : []));
}

/** A line along a ridge's shape, a little way below it, in broken runs: the edge of a rock band or a snow field. */
export function echoLines(seed: string, line: readonly Pt[], y: (x: number) => number, x0: number, x1: number, opts: { count: number; start: number; gap: number; w?: number; o?: number; z: Depth; at: number }): Piece[] {
  const r = createRng(hashSeed(seed));
  const nz = noise(hashSeed(`${seed}:e`));
  const out: Piece[] = [];
  for (let k = 0; k < opts.count; k++) {
    const off = opts.start + k * opts.gap + spread(r, 3);
    let x = x0 + r() * 30;
    while (x < x1 - 12) {
      const len = 24 + r() * 70;
      const xe = Math.min(x1, x + len);
      const pts = sample(x, xe, 6, (px) => y(px) + off + nz(px * 0.05 + k * 7) * 5 * (1 + k * 0.4));
      if (pts.length > 3) out.push({ d: curve(pts), w: opts.w ?? 0.7, o: (opts.o ?? 0.75) * (1 - k * 0.12), at: opts.at + k * 160 + (x - x0) * 0.7, dur: Math.max(200, len * 5), how: "draw", z: opts.z });
      x = xe + 10 + r() * 46;
    }
  }
  return out;
}

// ─── Trees ──────────────────────────────────────────────────────────────

type PineOpts = {
  cx: number;
  /** Where the foot of the trunk stands. */
  base: number;
  h: number;
  /** Width against height. */
  fat?: number;
  /** Lean of the top, in px. */
  lean?: number;
  snow?: boolean;
  /** Density of the shading under the boughs. */
  hatch?: number;
  w?: number;
  z: Depth;
  at: number;
  /** ms for the outline. */
  dur?: number;
  /** A group for the whole tree, so it can sway as one. */
  g?: string;
};

type Bough = { from: Pt; to: Pt; c: Pt };

/**
 * A conifer: one pulled outline of drooping boughs and the notches between
 * them, a trunk, and short strokes hung under each bough on the shaded
 * (right-hand) side.
 */
export function pine(r: Rng, o: PineOpts): Piece[] {
  const { cx, base, h } = o;
  const tiers = clamp(Math.round(h / 9.5), 4, 12);
  const trunk = Math.max(2, h * 0.06);
  const top = base - h;
  const foliage = h - trunk;
  const tierH = foliage / tiers;
  const hw = h * 0.19 * (o.fat ?? 1);
  const lean = o.lean ?? 0;
  const apex: Pt = [cx + lean, top];

  // One side from the apex down: boughs out to each tip, notches back in.
  const side = (sign: -1 | 1) => {
    const boughs: Bough[] = [];
    const tips: Pt[] = [];
    const notches: Pt[] = [];
    let from = apex;
    for (let i = 1; i <= tiers; i++) {
      const t = i / tiers;
      const yb = top + foliage * Math.pow(t, 0.95);
      const half = hw * (0.2 + 0.8 * Math.pow(t, 0.8)) * (0.88 + r() * 0.24);
      const bend = lean * (1 - t);
      const tip: Pt = [cx + bend + sign * half, yb + tierH * (0.1 + r() * 0.12)];
      const dx = tip[0] - from[0];
      const dy = tip[1] - from[1];
      boughs.push({ from, to: tip, c: [from[0] + dx * 0.55, from[1] + dy * 0.2 - Math.abs(dx) * 0.05] });
      tips.push(tip);
      if (i < tiers) {
        from = [cx + bend * 0.8 + sign * half * (0.3 + r() * 0.1), yb - tierH * (0.12 + r() * 0.1)];
        notches.push(from);
      }
    }
    return { boughs, tips, notches };
  };
  const L = side(-1);
  const R = side(1);

  // Down the left: bough, inner edge, bough...
  let d = `M${f(apex[0])} ${f(apex[1])}`;
  for (let i = 0; i < tiers; i++) {
    const b = L.boughs[i];
    d += `Q${f(b.c[0])} ${f(b.c[1])} ${f(b.to[0])} ${f(b.to[1])}`;
    if (i < tiers - 1) d += `L${f(L.notches[i][0])} ${f(L.notches[i][1])}`;
  }
  // Across the foot of the skirt, then back up the right.
  const footL = L.tips[tiers - 1];
  const footR = R.tips[tiers - 1];
  d += `Q${f(cx)} ${f(Math.max(footL[1], footR[1]) + h * 0.05)} ${f(footR[0])} ${f(footR[1])}`;
  for (let i = tiers - 1; i >= 0; i--) {
    const b = R.boughs[i];
    // This bough, backwards: from its tip to where it started.
    d += `Q${f(b.c[0])} ${f(b.c[1])} ${f(b.from[0])} ${f(b.from[1])}`;
    if (i > 0) d += `L${f(R.tips[i - 1][0])} ${f(R.tips[i - 1][1])}`;
  }
  const dur = o.dur ?? 300 + h * 2.6;
  const wt = o.w ?? 1.05;
  const out: Piece[] = [{ d: d + trunkPath(cx, base, trunk, h, r), w: wt, at: o.at, dur, how: "draw", z: o.z }];

  // The skirt of each tier hangs over the one below: a scalloped line from tip to tip.
  const skirts: string[] = [];
  for (let i = 0; i < tiers - 1; i++) {
    const a = L.tips[i];
    const b = R.tips[i];
    const n = tiers > 6 ? 3 : 2;
    let sk = `M${f(a[0])} ${f(a[1])}`;
    for (let j = 1; j <= n; j++) {
      const p0x = lerp(a[0], b[0], (j - 1) / n);
      const p1x = lerp(a[0], b[0], j / n);
      const y0 = lerp(a[1], b[1], j / n) + spread(r, 0.6);
      sk += `Q${f((p0x + p1x) / 2)} ${f(y0 + tierH * (0.34 + r() * 0.1))} ${f(p1x)} ${f(y0)}`;
    }
    skirts.push(sk);
  }
  out.push({ d: skirts.join(""), w: wt * 0.8, o: 0.95, at: o.at + dur * 0.35, dur: dur * 0.5, how: "sweep", down: true, z: o.z });

  // Shading hung under each right-hand bough; on bare trees a little under the left toward the foot.
  const density = o.hatch ?? 1;
  if (density > 0) {
    const pairs: Pt[][] = [];
    for (let i = 0; i < tiers; i++) {
      const b = R.boughs[i];
      const n = Math.max(2, Math.round(Math.abs(b.to[0] - b.from[0]) / (2.3 / density)));
      for (let j = 1; j <= n; j++) {
        const t = j / (n + 0.5);
        // A point on the bough's curve.
        const px = (1 - t) * (1 - t) * b.from[0] + 2 * (1 - t) * t * b.c[0] + t * t * b.to[0] + spread(r, 0.3);
        const py = (1 - t) * (1 - t) * b.from[1] + 2 * (1 - t) * t * b.c[1] + t * t * b.to[1] + 0.8;
        const len = tierH * (0.5 + (1 - t) * 0.55) * (0.8 + r() * 0.4);
        pairs.push([[px, py], [px + len * 0.26, py + len]]);
      }
      if (!o.snow && i > tiers * 0.5) {
        const bl = L.boughs[i];
        for (let j = 1; j <= 2; j++) {
          const t = (j + 0.5) / 3;
          const px = (1 - t) * (1 - t) * bl.from[0] + 2 * (1 - t) * t * bl.c[0] + t * t * bl.to[0];
          const py = (1 - t) * (1 - t) * bl.from[1] + 2 * (1 - t) * t * bl.c[1] + t * t * bl.to[1] + 0.8;
          pairs.push([[px, py], [px + 2.2, py + tierH * 0.7]]);
        }
      }
    }
    out.push({ d: polys(pairs), w: wt * 0.72, o: 0.9, at: o.at + dur * 0.55, dur: dur * 0.5, how: "sweep", down: true, z: o.z });
  }
  return o.g ? out.map((piece) => ({ ...piece, g: o.g })) : out;
}

function trunkPath(cx: number, base: number, trunk: number, h: number, r: Rng) {
  const w = Math.max(1.2, h * 0.018);
  const x = cx + spread(r, 0.4);
  return `M${f(x - w)} ${f(base - trunk)}L${f(x - w - 0.2)} ${f(base)}M${f(x + w)} ${f(base - trunk)}L${f(x + w + 0.3)} ${f(base)}`;
}

/** A pine by silhouette only, for the far side of a valley: a few boughs and a few ticks of shade. */
function littlePine(r: Rng, cx: number, base: number, h: number, snow = false): { line: Pt[]; hatch: Pt[][] } {
  const w = h * (0.2 + r() * 0.06);
  const tiers = h > 15 ? 4 : 3;
  const ys = Array.from({ length: tiers }, (_, i) => base - h + h * 0.93 * ((i + 1) / tiers));
  const halves = ys.map((_, i) => w * (0.25 + 0.75 * ((i + 1) / tiers)) + r() * 0.8);
  const left: Pt[] = [[cx, base - h]];
  for (let i = 0; i < tiers; i++) {
    left.push([cx - halves[i], ys[i]]);
    if (i < tiers - 1) left.push([cx - halves[i] * 0.42, ys[i] - h * 0.07]);
  }
  const right: Pt[] = [];
  for (let i = tiers - 1; i >= 0; i--) {
    right.push([cx + halves[i], ys[i]]);
    if (i > 0) right.push([cx + halves[i - 1] * 0.42, ys[i - 1] - h * 0.07]);
  }
  const hatch: Pt[][] = [[[cx, ys[tiers - 1]], [cx + 0.2, base]]];
  if (!snow) {
    for (let i = 0; i < tiers; i++) {
      hatch.push([[cx + halves[i] * 0.2, ys[i] - h * 0.15], [cx + halves[i] * 0.42, ys[i] - h * 0.02]]);
      hatch.push([[cx + halves[i] * 0.55, ys[i] - h * 0.14], [cx + halves[i] * 0.82, ys[i] - h * 0.01]]);
    }
  }
  return { line: [...left, ...right, [cx, base - h]], hatch };
}

type ForestOpts = {
  seed: string;
  x0: number;
  x1: number;
  /** Where the trees stand at x. */
  ground: (x: number) => number;
  /** Tree heights, min and max, in px. */
  size: [number, number];
  /** Trees per 100px. */
  density: number;
  /** A taller tree toward `lean` (x) or shorter, as a fraction. */
  taper?: (x: number) => number;
  snow?: boolean;
  w?: number;
  z: Depth;
  at: number;
  /** Chunks, drawn one after another left to right. */
  chunks?: number;
  ms?: number;
};

/** A stand of small pines in chunks that ink in left to right. */
export function forest(o: ForestOpts): Piece[] {
  const r = createRng(hashSeed(o.seed));
  const chunks = o.chunks ?? 6;
  const span = (o.x1 - o.x0) / chunks;
  const out: Piece[] = [];
  for (let c = 0; c < chunks; c++) {
    const lines: Pt[][] = [];
    const ticks: Pt[][] = [];
    const xa = o.x0 + c * span;
    const n = Math.max(2, Math.round((span / 100) * o.density));
    // Back to front, so nearer trees overlap the ones behind.
    const trees = Array.from({ length: n }, () => ({ x: xa + r() * span, depth: r() })).sort((a, b) => a.depth - b.depth);
    for (const t of trees) {
      const k = o.taper?.(t.x) ?? 1;
      const h = lerp(o.size[0], o.size[1], r() ** 1.4) * k;
      if (h < 6) continue;
      const base = o.ground(t.x) + t.depth * 5;
      const { line, hatch } = littlePine(r, t.x, base, h, o.snow);
      lines.push(line);
      ticks.push(...hatch);
    }
    out.push({ d: polys(lines) + polys(ticks), w: o.w ?? 0.8, o: 0.92, at: o.at + c * (o.ms ?? 260), dur: Math.max(220, (o.ms ?? 260) * 1.8), how: "sweep", z: o.z });
  }
  return out;
}

// ─── Water ──────────────────────────────────────────────────────────────

/** Still water: long level strokes with gaps, closer together toward the horizon. `avoid` are boxes (x0, y0, x1, y1) the lines stop short of. */
export function water(seed: string, o: { x0: number; x1: number; y0: number; y1: number; rows: number; edge: (y: number) => [number, number]; avoid?: readonly (readonly [number, number, number, number])[]; z: Depth; at: number; w?: number; rowMs?: number }): Piece[] {
  const r = createRng(hashSeed(seed));
  const out: Piece[] = [];
  for (let k = 0; k < o.rows; k++) {
    const t = k / (o.rows - 1);
    const y = lerp(o.y0, o.y1, Math.pow(t, 1.55));
    const [xa, xb] = o.edge(y);
    let x = xa + r() * 24;
    let first = true;
    while (x < xb - 10) {
      const len = lerp(26, 120, t) * (0.5 + r());
      const xe = Math.min(xb, x + len);
      if (xe - x > 8) {
        const wob = lerp(0.35, 1.1, t);
        // Cut round whatever stands in the water here.
        let spans: [number, number][] = [[x, xe]];
        for (const [bx0, by0, bx1, by1] of o.avoid ?? []) {
          if (y < by0 || y > by1) continue;
          spans = spans.flatMap(([a, b]): [number, number][] => (b <= bx0 || a >= bx1 ? [[a, b]] : [[a, Math.min(b, bx0)], [Math.max(a, bx1), b]]));
        }
        for (const [a, b] of spans) {
          if (b - a < 6) continue;
          const pts = sample(a, b, 10, (px) => y + Math.sin(px * 0.09 + k * 2) * wob + spread(r, 0.25));
          out.push({ d: curve(pts), w: (o.w ?? 0.75) * lerp(0.7, 1.15, t), o: lerp(0.55, 0.9, t), at: o.at + k * (o.rowMs ?? 70) + (first ? 0 : 20), dur: 220 + (b - a) * 2.4, how: "draw", z: o.z });
          first = false;
        }
      }
      x = xe + lerp(10, 34, r());
    }
  }
  return out;
}

/** The dark line a far shore throws on still water: short level dashes, thick under the shore and thinning out. */
export function shoreShadow(seed: string, o: { x0: number; x1: number; y: number; depth: number; ground?: (x: number) => number; z: Depth; at: number; w?: number }): Piece[] {
  const r = createRng(hashSeed(seed));
  const nz = noise(hashSeed(`${seed}:n`));
  const lines: Pt[][] = [];
  for (let row = 0; row < 6; row++) {
    const t = row / 5;
    const y = o.y + 2 + t * o.depth + spread(r, 0.6);
    let x = o.x0 + r() * 20;
    while (x < o.x1) {
      const len = 6 + r() * 26;
      const keep = nz(x * 0.04 + row * 2) * 0.5 + 0.5 > t * 0.9;
      if (keep) lines.push([[x, y + spread(r, 0.5)], [x + len, y + spread(r, 0.5)]]);
      x += len + 2 + r() * 8;
    }
  }
  return [{ d: polys(lines), w: o.w ?? 0.8, o: 0.85, at: o.at, dur: 900, how: "sweep", z: o.z }];
}

// ─── Ground ─────────────────────────────────────────────────────────────

/** Tufts of grass or reeds: fans of curved blades, as one cluster that inks in. */
export function tufts(seed: string, o: { x0: number; x1: number; ground: (x: number) => number; count: number; h: [number, number]; z: Depth; at: number; w?: number; reeds?: boolean }): Piece[] {
  const r = createRng(hashSeed(seed));
  const blades: string[] = [];
  for (let i = 0; i < o.count; i++) {
    const x = o.x0 + r() * (o.x1 - o.x0);
    const y = o.ground(x) + r() * 4;
    const h = lerp(o.h[0], o.h[1], r() ** 1.5);
    const n = 3 + Math.floor(r() * 4);
    for (let j = 0; j < n; j++) {
      const lean = (j / (n - 1) - 0.5) * h * (o.reeds ? 0.5 : 0.9) + spread(r, 1.2);
      const bh = h * (0.6 + r() * 0.4);
      const tip: Pt = [x + lean, y - bh];
      const c: Pt = [x + lean * 0.15 + spread(r, 1), y - bh * 0.6];
      blades.push(`M${f(x + spread(r, 1.4))} ${f(y)}Q${f(c[0])} ${f(c[1])} ${f(tip[0])} ${f(tip[1])}`);
    }
  }
  return [{ d: blades.join(""), w: o.w ?? 0.8, o: 0.9, at: o.at, dur: 700, how: "sweep", z: o.z }];
}

/** A boulder: a lumpy closed outline with shade hatched down its right. */
export function rock(r: Rng, cx: number, base: number, w: number, h: number, z: Depth, at: number): Piece[] {
  const n = 7;
  const pts: Pt[] = [];
  for (let i = 0; i <= n; i++) {
    const a = Math.PI + (i / n) * Math.PI;
    const k = 1 + spread(r, 0.12);
    pts.push([cx + Math.cos(a) * (w / 2) * k, base + Math.sin(a) * h * k * (i % 2 ? 1 : 0.88)]);
  }
  const hatch: Pt[][] = [];
  for (let i = 0; i < 5; i++) {
    const x = cx + w * (0.04 + i * 0.09);
    hatch.push([[x, base - h * (0.75 - i * 0.12)], [x + w * 0.1, base - 0.8]]);
  }
  return [
    { d: curve([...pts, pts[0]]) + `M${f(cx - w / 2)} ${f(base)}L${f(cx + w / 2)} ${f(base - 0.4)}`, w: 0.95, at, dur: 320, how: "draw", z },
    { d: polys(hatch), w: 0.7, o: 0.85, at: at + 260, dur: 300, how: "sweep", z },
  ];
}

// ─── Sky and small things ───────────────────────────────────────────────

/** Long thin strokes laid across the sky, the way a hand does a cloud bank. */
export function streaks(seed: string, o: { x0: number; x1: number; y0: number; y1: number; rows: number; z: Depth; at: number; o?: number; len?: [number, number] }): Piece[] {
  const r = createRng(hashSeed(seed));
  const nz = noise(hashSeed(`${seed}:s`));
  const out: Piece[] = [];
  const lines: Pt[][] = [];
  for (let k = 0; k < o.rows; k++) {
    const y = lerp(o.y0, o.y1, k / Math.max(1, o.rows - 1)) + spread(r, 3);
    let x = o.x0 + r() * 80;
    while (x < o.x1) {
      const [mn, mx] = o.len ?? [40, 190];
      const len = lerp(mn, mx, r());
      if (nz(x * 0.01 + k * 3) > -0.15) lines.push(sample(x, x + len, 14, (px) => y + Math.sin(px * 0.03 + k) * 1.2 + spread(r, 0.3)) as Pt[]);
      x += len + 20 + r() * 90;
    }
  }
  // Chunks of rows, so the sky fills in a band at a time.
  const per = Math.ceil(lines.length / 4);
  for (let i = 0; i < lines.length; i += per) out.push({ d: lines.slice(i, i + per).map(curve).join(""), w: 0.7, o: o.o ?? 0.5, at: o.at + (i / per) * 260, dur: 900, how: "sweep", z: o.z });
  return out;
}

/** A thin crescent moon with a few strokes of glow, drawn only at night. */
export function moon(cx: number, cy: number, rad: number, z: Depth, at: number): Piece[] {
  const outer = `M${f(cx + rad * 0.2)} ${f(cy - rad)}A${f(rad)} ${f(rad)} 0 1 0 ${f(cx + rad * 0.2)} ${f(cy + rad)}A${f(rad * 0.82)} ${f(rad * 0.82)} 0 0 1 ${f(cx + rad * 0.2)} ${f(cy - rad)}Z`;
  const r = createRng(hashSeed("moon"));
  const glow: Pt[][] = [];
  for (let i = 0; i < 18; i++) {
    const a = r() * Math.PI * 2;
    const d0 = rad * (1.45 + r() * 0.35);
    const d1 = d0 + rad * (0.18 + r() * 0.25);
    glow.push([[cx + Math.cos(a) * d0, cy + Math.sin(a) * d0], [cx + Math.cos(a) * d1, cy + Math.sin(a) * d1]]);
  }
  return [
    { d: outer, w: 1.1, at, dur: 700, how: "draw", z, only: "night" },
    { d: polys(glow), w: 0.8, o: 0.55, at: at + 560, dur: 600, how: "sweep", z, only: "night", g: "rays" },
  ];
}

/** A scatter of little stars, some crossed, some dots. */
export function stars(seed: string, o: { x0: number; x1: number; y0: number; y1: number; count: number; z: Depth; at: number }): Piece[] {
  const r = createRng(hashSeed(seed));
  const marks: string[] = [];
  for (let i = 0; i < o.count; i++) {
    const x = lerp(o.x0, o.x1, r());
    const y = lerp(o.y0, o.y1, r() ** 1.3);
    const s = 1.3 + r() * 2.4;
    if (r() > 0.55) marks.push(`M${f(x - s)} ${f(y)}L${f(x + s)} ${f(y)}M${f(x)} ${f(y - s)}L${f(x)} ${f(y + s)}`);
    else marks.push(`M${f(x)} ${f(y)}l0.1 0.1`);
  }
  return [{ d: marks.join(""), w: 1.1, o: 0.85, at: o.at, dur: 1200, how: "sweep", z: o.z, only: "night", cls: "stars" }];
}

// ─── Trees, bare ────────────────────────────────────────────────────────

/** A bare tree: a bent trunk and forking boughs, finer toward the ends. */
export function bareTree(r: Rng, x: number, base: number, h: number, z: Depth, at: number, w = 1.1): Piece[] {
  const out: Piece[] = [];
  const grow = (from: Pt, angle: number, len: number, depth: number, delay: number) => {
    if (len < 4 || depth > 5) return;
    const bend = spread(r, 0.28);
    const mid: Pt = [from[0] + Math.cos(angle + bend) * len * 0.5, from[1] + Math.sin(angle + bend) * len * 0.5];
    const end: Pt = [from[0] + Math.cos(angle + bend * 1.6) * len, from[1] + Math.sin(angle + bend * 1.6) * len];
    out.push({ d: `M${f(from[0])} ${f(from[1])}Q${f(mid[0])} ${f(mid[1])} ${f(end[0])} ${f(end[1])}`, w: Math.max(0.6, w * (1.3 - depth * 0.2)), at: at + delay, dur: 120 + len * 6, how: "draw", z });
    const forks = depth < 1 ? 2 : depth < 3 ? 2 + (r() > 0.55 ? 1 : 0) : 2;
    for (let i = 0; i < forks; i++) {
      const turn = (i - (forks - 1) / 2) * (0.5 + r() * 0.4) + spread(r, 0.15);
      grow(end, angle + turn, len * (0.62 + r() * 0.2), depth + 1, delay + 120 + len * 4);
    }
  };
  grow([x, base], -Math.PI / 2 + spread(r, 0.12), h * 0.38, 0, 0);
  return out;
}


// ─── More scenery ───────────────────────────────────────────────────────

/**
 * A cloud: the outline of a few overlapping rounds, drawn along the top where
 * they meet in cusps, a flat sagging underside, and short strokes of shade
 * beneath it.
 */
export function cloud(seed: string, cx: number, cy: number, w: number, h: number, z: Depth, at: number, group = "cloud"): Piece[] {
  const r = createRng(hashSeed(seed));
  const n = 4;
  // Rounds along the width, the middle ones biggest.
  const rounds = Array.from({ length: n }, (_, i) => {
    const t = (i + 0.5) / n;
    const rad = h * (0.45 + 0.55 * Math.sin(Math.PI * t)) * (0.85 + r() * 0.3);
    return { x: cx - w / 2 + t * w + spread(r, w * 0.03), rad, y: cy - rad * 0.55 };
  });
  const top: Pt[] = [];
  for (const [i, c] of rounds.entries()) {
    for (let k = 0; k <= 40; k++) {
      const a = Math.PI + (k / 40) * Math.PI;
      const p: Pt = [c.x + Math.cos(a) * c.rad, c.y + Math.sin(a) * c.rad];
      // Only the outer edge of the union: not what lies inside a neighbour.
      if (rounds.some((o, j) => j !== i && Math.hypot(p[0] - o.x, p[1] - o.y) < o.rad * 0.985)) continue;
      top.push(p);
    }
  }
  top.sort((a, b) => a[0] - b[0]);
  const first = top[0];
  const last = top[top.length - 1];
  const under: Pt[] = [[last[0], last[1] + 1], [cx + w * 0.22, cy + h * 0.1], [cx - w * 0.12, cy + h * 0.13], [first[0], first[1] + 1]];
  const hatch: Pt[][] = [];
  for (let k = 0; k < Math.floor(w / 6); k++) {
    const px = cx - w / 2 + 8 + k * 6 + spread(r, 1.5);
    hatch.push([[px, cy + 2.5], [px - 3.5, cy + 2.5 + h * (0.1 + r() * 0.22)]]);
  }
  return [
    { d: curve(top) + curve(under), w: 0.95, at, dur: 500 + w * 2.4, how: "draw", z, g: group },
    { d: pulls(hatch), w: 0.7, o: 0.7, at: at + 400 + w * 1.2, dur: 380, how: "sweep", z, g: group },
  ];
}

/** A small sun: a ring, a patch of shade low on its right, and rays: drawn by day only. */
export function sun(cx: number, cy: number, rad: number, z: Depth, at: number): Piece[] {
  const r = createRng(hashSeed("sun"));
  const rays: Pt[][] = [];
  for (let i = 0; i < 11; i++) {
    const a = (i / 11) * Math.PI * 2 + 0.2;
    const d0 = rad * (1.35 + r() * 0.1);
    const d1 = rad * (1.75 + r() * 0.45);
    rays.push([[cx + Math.cos(a) * d0, cy + Math.sin(a) * d0], [cx + Math.cos(a) * d1, cy + Math.sin(a) * d1]]);
  }
  const shade: Pt[][] = [];
  for (let i = 0; i < 7; i++) shade.push([[cx + rad * (0.15 + i * 0.11), cy - rad * 0.2 + i * 0.9], [cx + rad * (0.1 + i * 0.1), cy + rad * (0.75 - i * 0.07)]]);
  return [
    { d: curve(ringPts(r, cx, cy, rad)), w: 1.1, at, dur: 560, how: "draw", z, only: "day" },
    { d: pulls(shade), w: 0.7, o: 0.8, at: at + 480, dur: 320, how: "sweep", z, only: "day" },
    { d: pulls(rays), w: 1, o: 0.85, at: at + 640, dur: 480, how: "sweep", z, only: "day", g: "rays" },
  ];
}

/** A little island: a low mound with a few pines, and the dashes of its mirror image beneath. */
export function island(seed: string, cx: number, cy: number, w: number, z: Depth, at: number): Piece[] {
  const r = createRng(hashSeed(seed));
  const mound = curve([[cx - w / 2, cy], [cx - w * 0.32, cy - w * 0.08], [cx - w * 0.1, cy - w * 0.12], [cx + w * 0.18, cy - w * 0.1], [cx + w * 0.38, cy - w * 0.05], [cx + w / 2, cy]]);
  const out: Piece[] = [{ d: mound, w: 1, at, dur: 500, how: "draw", z }];
  const trees = 3 + Math.floor(r() * 2);
  for (let i = 0; i < trees; i++) {
    const tx = cx + (i / (trees - 1) - 0.5) * w * 0.55 + spread(r, 2);
    out.push(...pine(r, { cx: tx, base: cy - w * 0.1 + spread(r, 1.5), h: 18 + r() * 14, z, at: at + 300 + i * 180, w: 0.85, hatch: 0.8 }));
  }
  const mirror: Pt[][] = [];
  for (let row = 0; row < 5; row++) {
    const y = cy + 2.5 + row * 2.6;
    const half = (w / 2) * (1 - row * 0.12);
    for (let x = cx - half; x < cx + half; x += 6 + r() * 8) mirror.push([[x, y + spread(r, 0.3)], [x + 3 + r() * 6, y + spread(r, 0.3)]]);
  }
  out.push({ d: pulls(mirror), w: 0.75, o: 0.8, at: at + 900, dur: 500, how: "sweep", z });
  return out;
}

/**
 * What a shore throws on still water: short level dashes, longest and
 * closest where the shore above is darkest, broken wherever a ripple
 * crosses. `dark(x)` is 0 to 1 along the water.
 */
export function mirror(seed: string, o: { x0: number; x1: number; y: number; depth: number; dark: (x: number) => number; z: Depth; at: number; w?: number }): Piece[] {
  const r = createRng(hashSeed(seed));
  const nz = noise(hashSeed(`${seed}:n`));
  const lines: Pt[][] = [];
  for (let y = o.y + 2; y < o.y + o.depth; y += 3.1 + r() * 1.2) {
    const t = (y - o.y) / o.depth;
    let x = o.x0 + r() * 10;
    while (x < o.x1) {
      const d = o.dark(x) * (1 - t * 0.85);
      const len = 5 + r() * 22 * (0.4 + d);
      if (d > 0.08 && 0.5 + 0.5 * nz(x * 0.06 + y * 0.3) < d * 1.25) lines.push([[x, y + spread(r, 0.35)], [x + len, y + spread(r, 0.35)]]);
      x += len + 2 + r() * (7 - d * 5);
    }
  }
  return [{ d: pulls(lines), w: o.w ?? 0.85, o: 0.9, at: o.at, dur: 900, how: "sweep", z: o.z }];
}

/** A tent: a ridge of canvas, its doorway, and shade down the side away from the light. */
export function tent(cx: number, base: number, w: number, h: number, z: Depth, at: number): Piece[] {
  const r = createRng(hashSeed("tent"));
  const apex: Pt = [cx + spread(r, 1), base - h];
  const l: Pt = [cx - w / 2, base];
  const rr: Pt = [cx + w / 2, base + spread(r, 1)];
  const door = poly([[cx - w * 0.04, base], [cx + w * 0.1, base - h * 0.62], [cx + w * 0.24, base]]);
  const hatch: Pt[][] = [];
  for (let i = 0; i < 7; i++) {
    const t = 0.35 + i * 0.09;
    hatch.push([[lerp(apex[0], rr[0], t) - 1, lerp(apex[1], rr[1], t) + 2], [lerp(apex[0], rr[0], t) - 4, lerp(apex[1], rr[1], t) + h * 0.35 * (1.1 - t)]]);
  }
  return [
    { d: poly([l, apex, rr]) + poly([[l[0] - 3, base + 0.5], [rr[0] + 4, base]]), w: 1.1, at, dur: 600, how: "draw", z },
    { d: door, w: 0.9, at: at + 500, dur: 250, how: "draw", z },
    { d: pulls(hatch), w: 0.75, o: 0.9, at: at + 700, dur: 400, how: "sweep", z },
  ];
}

/** The logs a fire is built on, crossed, and a few stones round it. */
export function logs(cx: number, base: number, z: Depth, at: number): Piece[] {
  const r = createRng(hashSeed("logs"));
  const stones: string[] = [];
  for (let i = 0; i < 7; i++) {
    const x = cx - 15 + (i / 6) * 30 + spread(r, 1);
    const y = base + 3.5 + Math.sin((i / 6) * Math.PI) * 1.8 + spread(r, 0.4);
    stones.push(curve(ringPts(r, x, y, 2.4, 1.6, 1.0)));
  }
  return [
    { d: poly([[cx - 9, base + 1], [cx + 8, base - 2.8]]) + poly([[cx + 9, base + 1], [cx - 8, base - 2.8]]), w: 1.3, at, dur: 300, how: "draw", z },
    { d: stones.join(""), w: 0.9, at: at + 250, dur: 380, how: "sweep", z },
  ];
}
