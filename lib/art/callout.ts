// Where a note's arrow should go: from the edge of the note to just short of
// the thing it is about. Pure geometry, so the arrow can be re-aimed whenever
// the layout moves.

import { clamp, type Pt } from "./kit.ts";

export type Rect = { left: number; top: number; width: number; height: number };

const centre = (r: Rect): Pt => [r.left + r.width / 2, r.top + r.height / 2];

/**
 * The arrow from `note` to `target`, in the note's own coordinates (its top
 * left is 0, 0). It leaves the note on the side facing the target and stops
 * `gap` short of it, at the point of the target nearest the note, or at
 * `at` (fractions across and down the target) when the point matters.
 * Returns null when they are so close there is no room for an arrow.
 */
export function aim(note: Rect, target: Rect, { at, gap = 8, pad = 6 }: { at?: readonly [number, number]; gap?: number; pad?: number } = {}): { from: Pt; to: Pt } | null {
  const [nx, ny] = centre(note);
  let p: Pt;
  if (at) p = [target.left + at[0] * target.width, target.top + at[1] * target.height];
  else {
    p = [clamp(nx, target.left, target.left + target.width), clamp(ny, target.top, target.top + target.height)];
    // The note is over the target: aim at its middle instead.
    if (p[0] === nx && p[1] === ny) p = centre(target);
  }
  const dx = nx - p[0];
  const dy = ny - p[1];
  const away = Math.hypot(dx, dy) || 1;
  const tip: Pt = [p[0] + (dx / away) * gap, p[1] + (dy / away) * gap];

  // Out of the note along the line to the tip: where that line crosses the note's edge.
  const vx = tip[0] - nx;
  const vy = tip[1] - ny;
  const len = Math.hypot(vx, vy) || 1;
  const ux = vx / len;
  const uy = vy / len;
  const tx = ux === 0 ? Infinity : (note.width / 2 + pad) / Math.abs(ux);
  const ty = uy === 0 ? Infinity : (note.height / 2 + pad) / Math.abs(uy);
  const t = Math.min(tx, ty);
  const from: Pt = [nx + ux * t, ny + uy * t];
  if (Math.hypot(tip[0] - from[0], tip[1] - from[1]) < 10) return null;
  const local = (q: Pt): Pt => [q[0] - note.left, q[1] - note.top];
  return { from: local(from), to: local(tip) };
}
