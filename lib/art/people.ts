// People, drawn the way a pen draws them a few dozen units tall: a head and a
// hat, a jacket, a pack, limbs that are single lines. Poses come from a small
// rig (a pelvis, two-bone legs, arms from the shoulder), so a walk is a real
// gait: each foot is planted while the body passes over it, and lifted and
// carried forward while the other takes the weight.
//
// A frame is two paths in the figure's own space: its feet at y = 0 on the
// ground, its face toward +x, y down, in the scene's units. The near side
// (jacket, pack, head, near arm and leg) is one, the far limbs the other, to
// be drawn lighter. Frames are pure functions of a look and a pose, so the
// same figure comes out the same everywhere; each frame's joints are
// nudged a hair by its own seed, so a walk shows the boil of hand-drawn
// animation.

import { createRng, spread, hashSeed, type Rng } from "./kit.ts";

type V = [number, number];

export type Look = {
  /** Standing height, in units. */
  h: number;
  hat: "brim" | "beanie" | "none";
  pack: boolean;
  /** A trekking pole in the near hand. */
  pole: boolean;
  seed: string;
};

export type Frame = { near: string; far: string };

/** How far a body goes in one whole gait (two steps), as a fraction of its height. */
export const STRIDE = 0.82;
/** The part of each step a foot spends on the ground. */
const STANCE = 0.62;

const r1 = (n: number) => Math.round(n * 10) / 10;
const at = (p: V) => `${r1(p[0])} ${r1(-p[1])}`;
const mid = (a: V, b: V): V => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const along = (a: V, angle: number, len: number): V => [a[0] + Math.sin(angle) * len, a[1] - Math.cos(angle) * len];
const smoothstep = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

const line = (...ps: V[]) => `M${at(ps[0])}${ps.slice(1).map((p) => `L${at(p)}`).join("")}`;

/** A smooth pen line through points: round at the middle ones, straight at the ends. */
function smooth(ps: V[], closed = false) {
  if (ps.length < 3) return line(...ps);
  const pts = closed ? [...ps, ps[0], ps[1]] : ps;
  let d = `M${at(closed ? mid(pts[0], pts[1]) : pts[0])}`;
  if (!closed) d += `L${at(mid(pts[0], pts[1]))}`;
  for (let i = 1; i < pts.length - 1; i++) d += `Q${at(pts[i])} ${at(mid(pts[i], pts[i + 1]))}`;
  if (!closed) d += `L${at(pts[pts.length - 1])}`;
  return d;
}

/** The knee (or elbow) of a two-bone limb from `a` to `b`; the joint bends toward +x, or away from it with `back`. */
function joint(a: V, b: V, l1: number, l2: number, back = false): { end: V; mid: V } {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const reach = l1 + l2 - 0.05;
  let d = Math.hypot(dx, dy);
  const end: V = d > reach ? [a[0] + (dx / d) * reach, a[1] + (dy / d) * reach] : b;
  d = Math.min(d, reach);
  const cos = Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * (d || 1))));
  const turn = Math.acos(cos) * (back ? -1 : 1);
  const base = Math.atan2(dy, dx);
  return { end, mid: [a[0] + Math.cos(base + turn) * l1, a[1] + Math.sin(base + turn) * l1] };
}

type Arm = { upper: number; flex: number };
type Spec = {
  hip: V;
  lean: number;
  feet: [V, V];
  toes: [number, number];
  arms: [Arm, Arm];
  /** Where the tip of the pole is, if there is one. */
  pole?: V;
  /** The head's tilt from the neck, and how far forward it sits. */
  nod?: number;
};

type Parts = { h: number; leg: number; torso: number; upper: number; fore: number; head: number };
const parts = (h: number): Parts => ({ h, leg: 0.256 * h, torso: 0.33 * h, upper: 0.19 * h, fore: 0.18 * h, head: 0.078 * h });

/** A point in the torso's own frame (a forward, b up, both in heights), from the pelvis. */
function onTorso(hip: V, lean: number, h: number) {
  return (a: number, b: number): V => [hip[0] + Math.cos(lean) * a * h + Math.sin(lean) * b * h, hip[1] - Math.sin(lean) * a * h + Math.cos(lean) * b * h];
}

function draw(look: Look, spec: Spec, salt: string): Frame {
  const p = parts(look.h);
  const rng: Rng = createRng(hashSeed(`${look.seed}:${salt}`));
  // The boil: every joint is a hair off where it should be, a different hair each frame.
  const nudge = (v: V, k = 0.1): V => [v[0] + spread(rng, k), v[1] + spread(rng, k)];
  const h = look.h;
  const { hip, lean } = spec;
  const torso = onTorso(hip, lean, h);
  const shoulder = torso(0.005, 0.33);
  const neckTop = torso(0.02, 0.405);
  const tilt = lean + 0.12 + (spec.nod ?? 0);
  const headC: V = [shoulder[0] + Math.sin(tilt) * 0.122 * h, shoulder[1] + Math.cos(tilt) * 0.122 * h];

  const leg = (foot: V, toe: number) => {
    // The foot is a short rigid stroke turned about the ankle; its lowest end rests at the foot's height.
    const sole = 0.03 * h;
    const c = Math.cos(toe);
    const s = Math.sin(toe);
    const rel = (x: number, y: number): V => [x * c - y * s, x * s + y * c];
    const heelRel = rel(-0.025 * h, -sole);
    const toeRel = rel(0.085 * h, -sole);
    const ankle: V = [foot[0], foot[1] - Math.min(heelRel[1], toeRel[1])];
    const j = joint(hip, ankle, p.leg, p.leg);
    return smooth([hip, nudge(j.mid, 0.12), nudge(j.end, 0.1)]) + line([ankle[0] + heelRel[0], ankle[1] + heelRel[1]], [ankle[0] + toeRel[0], ankle[1] + toeRel[1]]);
  };
  const arm = (a: Arm, sh: V = shoulder) => {
    const elbow = along(sh, a.upper, p.upper);
    const hand = along(elbow, a.upper + a.flex, p.fore);
    return { elbow, hand, d: smooth([sh, nudge(elbow, 0.12), nudge(hand, 0.1)]) };
  };

  // Far side: its leg and arm, behind the body.
  const farArm = arm(spec.arms[1], torso(0.0, 0.325));
  const far = leg(spec.feet[1], spec.toes[1]) + farArm.d;

  // Near side: body, pack, head, then the limbs in front of it.
  const jacket = smooth(
    [torso(-0.053, 0), torso(0.055, 0), torso(0.063, 0.2), torso(0.05, 0.33), torso(-0.05, 0.325), torso(-0.064, 0.18)].map((v) => nudge(v, 0.08)),
    true,
  );
  let near = jacket;
  if (look.pack) {
    near +=
      smooth([torso(-0.05, 0.3), torso(-0.13, 0.285), torso(-0.158, 0.17), torso(-0.136, 0.05), torso(-0.054, 0.03)].map((v) => nudge(v, 0.08)), true) +
      smooth([torso(-0.05, 0.335), torso(-0.105, 0.36), torso(-0.152, 0.322)]) +
      line(torso(-0.12, 0.2), torso(-0.1, 0.07)) +
      smooth([torso(0.03, 0.32), torso(0.05, 0.2), torso(0.02, 0.1), torso(-0.052, 0.045)]);
  }
  const head = ringAt(headC, p.head, rng);
  near += line(neckTop, [headC[0] - p.head * 0.2, headC[1] - p.head * 0.9]) + head;
  // A nose, so he is facing somewhere.
  near += line([headC[0] + p.head * 0.98, headC[1] - p.head * 0.12], [headC[0] + p.head * 1.34, headC[1] - p.head * 0.42], [headC[0] + p.head * 0.98, headC[1] - p.head * 0.62]);
  near += hat(look.hat, headC, p.head);
  near += leg(spec.feet[0], spec.toes[0]);
  const nearArm = arm(spec.arms[0]);
  near += nearArm.d;
  if (spec.pole) {
    const dir: V = [nearArm.hand[0] - spec.pole[0], nearArm.hand[1] - spec.pole[1]];
    const len = Math.hypot(...dir) || 1;
    near += line(spec.pole, [nearArm.hand[0] + (dir[0] / len) * 0.09 * h, nearArm.hand[1] + (dir[1] / len) * 0.09 * h]);
  }
  return { near, far };
}

/** A head the way a pen draws a ring: it overshoots where it started, and is never quite round. */
function ringAt(c: V, r: number, rng: Rng): string {
  const pts: V[] = [];
  const start = -Math.PI * (0.55 + rng() * 0.2);
  for (let i = 0; i <= 12; i++) {
    const a = start + (i / 12) * Math.PI * 2 * 1.05;
    const k = 1 + 0.04 * Math.sin(a * 2 + 1) + spread(rng, 0.015) - (i / 12) * 0.05;
    pts.push([c[0] + Math.cos(a) * r * k, c[1] - Math.sin(a) * r * k]);
  }
  return smooth(pts);
}

function hat(kind: Look["hat"], c: V, r: number): string {
  if (kind === "brim") {
    return (
      smooth([[c[0] - r * 0.98, c[1] + r * 0.28], [c[0] - r * 0.8, c[1] + r * 1.3], [c[0] + r * 0.1, c[1] + r * 1.62], [c[0] + r * 0.92, c[1] + r * 0.72]]) +
      smooth([[c[0] - r * 1.5, c[1] + r * 0.46], [c[0] + r * 0.2, c[1] + r * 0.62], [c[0] + r * 1.85, c[1] + r * 0.4]])
    );
  }
  if (kind === "beanie") {
    return (
      smooth([[c[0] - r * 1.0, c[1] + r * 0.3], [c[0] - r * 0.85, c[1] + r * 1.15], [c[0] + r * 0.1, c[1] + r * 1.5], [c[0] + r * 0.98, c[1] + r * 0.55]]) +
      line([c[0] - r * 1.04, c[1] + r * 0.46], [c[0] + r * 1.02, c[1] + r * 0.4]) +
      ringAt([c[0] - r * 0.08, c[1] + r * 1.78], r * 0.3, createRng(7))
    );
  }
  return "";
}

// ─── The walk ───────────────────────────────────────────────────────────

/** Where a foot is, relative to the pelvis, at `p` through its step, and how its toes are turned. */
export function footAt(h: number, p: number): { foot: V; toe: number } {
  p = ((p % 1) + 1) % 1;
  const step = STANCE * STRIDE * h;
  if (p < STANCE) {
    const u = p / STANCE;
    // On the ground: it slides back under the body at the body's own speed. Heel first, then flat, then the heel comes up.
    const toe = u < 0.3 ? 0.38 * (1 - smoothstep(u / 0.3)) : u > 0.72 ? -0.62 * smoothstep((u - 0.72) / 0.28) : 0;
    return { foot: [step / 2 - u * step, 0], toe };
  }
  const u = (p - STANCE) / (1 - STANCE);
  // In the air: carried forward, lifted in the middle.
  const lift = 0.09 * h * Math.pow(Math.sin(Math.PI * u), 0.8);
  return { foot: [-step / 2 + smoothstep(u) * step, lift], toe: -0.5 + 0.8 * smoothstep(u * 1.15) };
}

function walkSpec(look: Look, phase: number): Spec {
  const h = look.h;
  const near = footAt(h, phase);
  const far = footAt(h, phase + 0.5);
  const bob = 0.016 * h * Math.cos(4 * Math.PI * (phase - STANCE / 2));
  const swing = Math.cos(2 * Math.PI * phase);
  const hip: V = [0, 0.452 * h + bob];
  const reach = look.pole ? 0.3 : 0.5;
  const flex = (a: number) => 0.3 + 0.38 * Math.max(0, a / reach);
  const aNear = -reach * swing;
  const aFar = reach * swing;
  const spec: Spec = {
    hip,
    lean: 0.13 + 0.02 * Math.sin(4 * Math.PI * phase),
    feet: [near.foot, far.foot],
    toes: [near.toe, far.toe],
    arms: [
      { upper: look.pole ? 0.2 + aNear * 0.5 + 0.4 : aNear, flex: look.pole ? 0.9 : flex(aNear) },
      { upper: aFar, flex: flex(aFar) },
    ],
  };
  if (look.pole) {
    // The pole is planted ahead, opposite the near foot, and slides back as the body passes it.
    const s = footAt(h, phase + 0.5);
    spec.pole = [0.3 * h + s.foot[0], s.foot[1] * 1.1];
  }
  return spec;
}

/** One whole walk cycle, facing +x: `n` frames, the first with the near foot just striking the ground. */
export function walkFrames(look: Look, n = 12): Frame[] {
  return Array.from({ length: n }, (_, i) => draw(look, walkSpec(look, i / n), `walk${i}`));
}

// ─── Other poses ────────────────────────────────────────────────────────

/** Standing about: two frames, a breath apart. */
export function standFrames(look: Look): Frame[] {
  const h = look.h;
  return [0, 1].map((i) =>
    draw(
      look,
      {
        hip: [0, 0.452 * h + i * 0.005 * h],
        lean: 0.05 + i * 0.012,
        feet: [[0.05 * h, 0], [-0.045 * h, 0]],
        toes: [0, 0],
        arms: [{ upper: 0.12 + i * 0.05, flex: 0.2 + i * 0.1 }, { upper: -0.1 - i * 0.03, flex: 0.18 }],
        pole: look.pole ? [0.14 * h, 0] : undefined,
        nod: i * 0.04,
      },
      `stand${i}`,
    ),
  );
}

/** A wave: the near arm up, the forearm swinging. */
export function waveFrames(look: Look): Frame[] {
  const h = look.h;
  return [0.95, 1.55].map((flex, i) =>
    draw(
      look.pole ? { ...look, pole: false } : look,
      {
        hip: [0, 0.452 * h + i * 0.004 * h],
        lean: 0.02,
        feet: [[0.05 * h, 0], [-0.045 * h, 0]],
        toes: [0, 0],
        arms: [{ upper: 1.75, flex }, { upper: -0.1, flex: 0.2 }],
        nod: -0.1,
      },
      `wave${i}`,
    ),
  );
}

/** Sitting on the ground, knees up, hands out to a fire: two frames. */
export function sitFrames(look: Look): Frame[] {
  const h = look.h;
  return [0.62, 0.85].map((flex, i) =>
    draw(
      look.pole ? { ...look, pole: false } : look,
      {
        hip: [0, 0.062 * h],
        lean: 0.06,
        feet: [[0.34 * h, 0], [0.29 * h, 0]],
        toes: [0.1, 0.1],
        arms: [{ upper: 1.2 + i * 0.08, flex }, { upper: 0.95, flex: flex + 0.1 }],
        nod: 0.06,
      },
      `sit${i}`,
    ),
  );
}

/** Half way up or down between standing and sitting. */
export function crouchFrame(look: Look): Frame {
  const h = look.h;
  return draw(
    look.pole ? { ...look, pole: false } : look,
    { hip: [-0.01 * h, 0.27 * h], lean: 0.5, feet: [[0.08 * h, 0], [-0.03 * h, 0]], toes: [0, 0], arms: [{ upper: 0.9, flex: 0.7 }, { upper: 0.7, flex: 0.7 }] },
    "crouch",
  );
}

/** Face on: for the moment between walking one way and walking back. */
export function turnFrame(look: Look): Frame {
  const h = look.h;
  const rng = createRng(hashSeed(`${look.seed}:turn`));
  const p = parts(h);
  const hip: V = [0, 0.452 * h];
  const sh = 0.78 * h;
  const c: V = [0, sh + 0.11 * h];
  const body = smooth([[-0.052 * h, hip[1]], [0.052 * h, hip[1]], [0.066 * h, sh - 0.12 * h], [0.088 * h, sh], [-0.088 * h, sh], [-0.066 * h, sh - 0.12 * h]], true);
  const legs = line([-0.03 * h, hip[1]], [-0.062 * h, 0.03 * h], [-0.09 * h, 0.03 * h]) + line([0.03 * h, hip[1]], [0.062 * h, 0.03 * h], [0.09 * h, 0.03 * h]);
  const arms = line([-0.088 * h, sh - 0.01 * h], [-0.115 * h, sh - 0.17 * h], [-0.1 * h, sh - 0.31 * h]) + line([0.088 * h, sh - 0.01 * h], [0.115 * h, sh - 0.17 * h], [0.1 * h, sh - 0.31 * h]);
  const straps = line([-0.04 * h, sh], [-0.045 * h, sh - 0.2 * h]) + line([0.04 * h, sh], [0.045 * h, sh - 0.2 * h]);
  const hatFront = (() => {
    if (look.hat === "none") return "";
    const r = p.head;
    return smooth([[c[0] - r * 1.0, c[1] + r * 0.35], [c[0] - r * 0.8, c[1] + r * 1.35], [c[0], c[1] + r * 1.6], [c[0] + r * 0.8, c[1] + r * 1.35], [c[0] + r * 1.0, c[1] + r * 0.35]]) + (look.hat === "brim" ? line([c[0] - r * 1.6, c[1] + r * 0.45], [c[0] + r * 1.6, c[1] + r * 0.45]) : line([c[0] - r, c[1] + r * 0.5], [c[0] + r, c[1] + r * 0.5]));
  })();
  return { far: legs, near: body + arms + (look.pack ? straps : "") + ringAt(c, p.head, rng) + hatFront + line([0, sh], [0, sh + 0.035 * h]) };
}
