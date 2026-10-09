// What a hand-drawn stroke on the front page was meant to be: a box, a loop,
// a line, a tick, a scribble, or just a doodle. Pure geometry with no
// imports, so it runs in the browser and in the unit tests alike.

export type Point = { x: number; y: number };
export type Box = { x: number; y: number; w: number; h: number };
export type ShapeKind = "box" | "loop" | "line" | "check" | "scribble" | "doodle";
export type Shape = { kind: ShapeKind; box: Box; length: number; points: Point[] };

const dist = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

export function boundsOf(points: readonly Point[]): Box {
  let [x0, y0, x1, y1] = [Infinity, Infinity, -Infinity, -Infinity];
  for (const p of points) {
    x0 = Math.min(x0, p.x);
    y0 = Math.min(y0, p.y);
    x1 = Math.max(x1, p.x);
    y1 = Math.max(y1, p.y);
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

function lengthOf(points: readonly Point[]) {
  let l = 0;
  for (let i = 1; i < points.length; i++) l += dist(points[i - 1], points[i]);
  return l;
}

/** The stroke as `n` points evenly spaced along it, so speed doesn't skew anything. */
export function resample(points: readonly Point[], n = 64): Point[] {
  const total = lengthOf(points);
  if (points.length < 2 || total === 0) return points.slice(0, 1);
  const step = total / (n - 1);
  const out: Point[] = [points[0]];
  let carry = 0;
  for (let i = 1; i < points.length && out.length < n; i++) {
    let a = points[i - 1];
    const b = points[i];
    let seg = dist(a, b);
    while (carry + seg >= step && out.length < n) {
      const t = (step - carry) / seg;
      const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
      out.push(p);
      seg -= step - carry;
      a = p;
      carry = 0;
    }
    carry += seg;
  }
  while (out.length < n) out.push(points[points.length - 1]);
  return out;
}

/**
 * The stroke with the hand's tremor taken out: points closer together than
 * a tremor dropped, then evened out along it and each eased toward its
 * neighbours. What's left is the shape the hand meant.
 */
function steady(raw: readonly Point[], size: number) {
  const min = Math.max(2, size * 0.02);
  const kept: Point[] = [raw[0]];
  for (const p of raw) if (dist(kept[kept.length - 1], p) >= min) kept.push(p);
  if (kept.length < 2) kept.push(raw[raw.length - 1]);
  const pts = resample(kept);
  const k = [1, 2, 3, 2, 1];
  const smooth = pts.map((p, i) => {
    if (i < 2 || i > pts.length - 3) return p;
    let [x, y] = [0, 0];
    for (let j = -2; j <= 2; j++) {
      x += pts[i + j].x * k[j + 2];
      y += pts[i + j].y * k[j + 2];
    }
    return { x: x / 9, y: y / 9 };
  });
  // Easing takes the zigzag out of a scribble too, so it's counted on the stroke as it was.
  return { pts: smooth, loose: resample(kept, 128) };
}

/** The angle the pen turns through at each point, signed (clockwise on screen is positive). */
function turns(pts: readonly Point[]) {
  const out: number[] = [];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = Math.atan2(pts[i].y - pts[i - 1].y, pts[i].x - pts[i - 1].x);
    const b = Math.atan2(pts[i + 1].y - pts[i].y, pts[i + 1].x - pts[i].x);
    let d = b - a;
    while (d > Math.PI) d -= 2 * Math.PI;
    while (d < -Math.PI) d += 2 * Math.PI;
    out.push(d);
  }
  return out;
}

/** How many times the pen doubles back along one axis, ignoring shakes smaller than `slack`. */
function reversals(pts: readonly Point[], axis: "x" | "y", slack: number) {
  let count = 0;
  let dir = 0;
  let anchor = pts[0][axis];
  for (const p of pts) {
    const d = p[axis] - anchor;
    if (Math.abs(d) < slack) continue;
    const s = Math.sign(d);
    if (dir && s !== dir) count++;
    dir = s;
    anchor = p[axis];
  }
  return count;
}

/** The convex hull (monotone chain). */
function hull(points: readonly Point[]) {
  const pts = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const cross = (o: Point, a: Point, b: Point) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const half = (list: Point[]) => {
    const out: Point[] = [];
    for (const p of list) {
      while (out.length >= 2 && cross(out[out.length - 2], out[out.length - 1], p) <= 0) out.pop();
      out.push(p);
    }
    return out.slice(0, -1);
  };
  return [...half(pts), ...half([...pts].reverse())];
}

function areaOf(poly: readonly Point[]) {
  let a = 0;
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    a += p.x * q.y - q.x * p.y;
  }
  return Math.abs(a / 2);
}

/**
 * The smallest rectangle round a hull at any angle (it lies along one of
 * the hull's edges), so a box drawn a little crooked still measures as a
 * box: its area and its long and short sides.
 */
function tightest(poly: readonly Point[]) {
  let best = { area: Infinity, long: 0, short: 0 };
  for (let i = 0; i < poly.length; i++) {
    const a = poly[i];
    const b = poly[(i + 1) % poly.length];
    const len = dist(a, b);
    if (!len) continue;
    const [ux, uy] = [(b.x - a.x) / len, (b.y - a.y) / len];
    let [u0, u1, v0, v1] = [Infinity, -Infinity, Infinity, -Infinity];
    for (const p of poly) {
      const u = (p.x - a.x) * ux + (p.y - a.y) * uy;
      const v = -(p.x - a.x) * uy + (p.y - a.y) * ux;
      u0 = Math.min(u0, u);
      u1 = Math.max(u1, u);
      v0 = Math.min(v0, v);
      v1 = Math.max(v1, v);
    }
    const [w, h] = [u1 - u0, v1 - v0];
    if (w * h < best.area) best = { area: w * h, long: Math.max(w, h), short: Math.min(w, h) };
  }
  return best;
}

/** True when the points run in one direction without straying from the line between their ends. */
function straight(pts: readonly Point[], tolerance = 0.86) {
  if (pts.length < 2) return false;
  const l = lengthOf(pts);
  return l > 0 && dist(pts[0], pts[pts.length - 1]) / l >= tolerance;
}

/**
 * Reads a stroke the way a person would glance at it, once the tremor's
 * taken out. A stroke that comes back round to where it began (or goes on
 * round past it) is a box if it fills the tightest rectangle round it, and
 * a loop if it fills only the π/4 of it an ellipse does; a stroke that
 * keeps doubling back is a scribble; a straight, level one is a line; a
 * short drop and a longer rise is a tick. Anything else is a doodle and
 * stays as drawn. Returns null for a tap.
 */
export function recognize(raw: readonly Point[]): Shape | null {
  const length = lengthOf(raw);
  const box = boundsOf(raw);
  const diag = Math.hypot(box.w, box.h);
  if (raw.length < 2 || length < 10 || diag < 8) return null;
  const { pts, loose } = steady(raw, diag);
  const shape = (kind: ShapeKind): Shape => ({ kind, box, length, points: pts });

  const turning = turns(pts);
  const signed = turning.reduce((s, d) => s + d, 0);
  const gap = dist(pts[0], pts[pts.length - 1]);
  const round = Math.abs(signed);
  const rect = tightest(hull(pts));

  // Back and forth over the same ground, without going round.
  const slack = Math.max(4, Math.min(box.w, box.h) * 0.2);
  const back = Math.max(reversals(loose, "x", slack), reversals(loose, "y", slack));
  const run = length / Math.max(box.w, box.h);
  if (round < 1.5 * Math.PI && ((back >= 6 && run >= 1.4) || (back >= 4 && run >= 2.2))) return shape("scribble");

  // Back round to the start (the turn back into the first side needn't be
  // drawn), or on round past it; with room inside.
  if (((gap <= Math.max(22, rect.long * 0.3) && round >= 1.1 * Math.PI) || round >= 1.85 * Math.PI) && rect.short >= 10) {
    // Judged by its first time round, so going round twice isn't counted twice.
    let sum = 0;
    let once = pts.length;
    for (let i = 0; i < turning.length; i++) {
      sum += turning[i];
      if (Math.abs(sum) >= 2.1 * Math.PI) {
        once = i + 2;
        break;
      }
    }
    const ring = hull(pts.slice(0, once));
    const fill = areaOf(ring) / Math.max(1, tightest(ring).area);
    return shape(fill >= 0.86 ? "box" : "loop");
  }

  // A straight pull, near enough level.
  if (straight(pts, 0.9)) {
    const a = pts[0];
    const b = pts[pts.length - 1];
    if (Math.abs(b.y - a.y) <= 0.3 * Math.abs(b.x - a.x) && Math.abs(b.x - a.x) >= 24) return shape("line");
    return shape("doodle");
  }

  // A tick: down to its lowest point, then a longer pull up and to the right.
  let low = 0;
  for (let i = 1; i < pts.length; i++) if (pts[i].y > pts[low].y) low = i;
  const first = pts.slice(0, low + 1);
  const second = pts.slice(low);
  if (low >= pts.length * 0.12 && low <= pts.length * 0.62) {
    const drop = dist(first[0], first[first.length - 1]);
    const rise = dist(second[0], second[second.length - 1]);
    const end = second[second.length - 1];
    const start = first[0];
    if (
      straight(first, 0.8) &&
      straight(second, 0.84) &&
      rise >= drop * 1.2 &&
      drop >= 5 &&
      end.x > pts[low].x &&
      end.y < start.y &&
      end.y < pts[low].y - rise * 0.5
    ) {
      return shape("check");
    }
  }

  return shape("doodle");
}
