// The stroke engine must be a pure function of its seed: the server and the
// browser draw the same wobble (no hydration mismatch), and screenshots are
// stable. The snapshot pins the geometry, so a change to how anything is
// drawn is a deliberate `pnpm test -- --test-update-snapshots`.

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import * as ink from "../../registry/ballpoint/lib/ink-sketch.ts";

const seed = ink.hashSeed("ballpoint");

// Every exported generator, called the way components call it.
const generators: Record<string, (s: number) => unknown> = {
  lineStroke: (s) => ink.lineStroke(s, [0, 0], [120, 8], { overshoot: 2 }),
  boxStroke: (s) => ink.boxStroke(s, 120, 40),
  loopStroke: (s) => ink.loopStroke(s, 60, 24),
  underlineStroke: (s) => ink.underlineStroke(s, 140),
  linkStroke: (s) => ink.linkStroke(s, 80),
  ruleStroke: (s) => ink.ruleStroke(s, 700),
  verticalStroke: (s) => ink.verticalStroke(s, 22),
  scribbleFill: (s) => ink.scribbleFill(s, 80, 30),
  hatchStrokes: (s) => ink.hatchStrokes(s, 60, 30),
  arrowStroke: (s) => ink.arrowStroke(s, 300),
  dotStroke: (s) => ink.dotStroke(s),
  blotPath: (s) => ink.blotPath(s),
  crossedBoxStroke: (s) => ink.crossedBoxStroke(s, 120, 40, { shift: [1.5, -1] }),
  shadeFill: (s) => ink.shadeFill(s, 120, 40),
  cornerTicks: (s) => ink.cornerTicks(s, 120, 40),
  tickStroke: (s) => ink.tickStroke(s, 16),
  crossStroke: (s) => ink.crossStroke(s, 16),
  dashStroke: (s) => ink.dashStroke(s, 16, 8),
  plusStroke: (s) => ink.plusStroke(s, 16),
  chevronDown: (s) => ink.chevronStroke(s, 12, 8),
  chevronRight: (s) => ink.chevronStroke(s, 8, 12, "right"),
  ringStroke: (s) => ink.ringStroke(s, 18),
  capsuleStroke: (s) => ink.capsuleStroke(s, 44, 24),
  roundedBoxStroke: (s) => ink.roundedBoxStroke(s, 120, 40, 10, { shift: [1, -1] }),
  penBoxStrokes: (s) => [
    ink.penBoxStrokes(s, 120, 40, { passes: 3 }),
    ink.penBoxStrokes(s, 20, 20, { corners: "joined", roughness: 0.5 }),
    ink.penBoxStrokes(s, 120, 40, { radius: 999, roughness: 2 }),
  ],
  zigzagPulls: (s) => ink.zigzagPulls(s, 20, 60),
  cornerPulls: (s) => ink.cornerPulls(s, 60, 60),
  starPulls: (s) => ink.starPulls(s, 40, 40),
  slashPulls: (s) => ink.slashPulls(s, 40, 20),
  flickPulls: (s) => ink.flickPulls(s),
  speckPulls: (s) => ink.speckPulls(s),
  signaturePulls: (s) => ink.signaturePulls(s, 760),
  underlineInk: (s) => ink.underlineInk(s, 140),
  inkPulls: (s) => ink.inkPulls(s, ink.starPulls(s, 40, 40), { retrace: 0.5 }),
  swipePath: (s) => ink.swipePath(s, 200, 32),
  handCurve: (s) => ink.handCurve(s, [[1, 1], [8, 3], [14, 12]]),
  handCurveClosed: (s) => ink.handCurve(s, [[1, 1], [8, 3], [14, 12]], { closed: true }),
};

// Pure helpers with no seed to vary.
const unseeded = ["createRng", "hashSeed", "roundedRectPath"];
const exported = Object.entries(ink).filter(([name, v]) => typeof v === "function" && !unseeded.includes(name));

describe("ink-sketch", () => {
  it("covers every exported generator", () => {
    const covered = new Set(Object.values(generators).map(String).join("").match(/ink\.(\w+)\(/g)?.map((m) => m.slice(4, -1)));
    assert.deepEqual(exported.map(([name]) => name).filter((name) => !covered.has(name)), []);
  });

  for (const [name, draw] of Object.entries(generators)) {
    it(`${name}: same seed, same strokes; new seed, new strokes`, () => {
      const a = JSON.stringify(draw(seed));
      assert.equal(JSON.stringify(draw(seed)), a);
      assert.notEqual(JSON.stringify(draw(seed + 1)), a);
      assert.doesNotMatch(a, /NaN|Infinity/);
    });
  }

  it("holds its geometry", (t) => {
    t.assert.snapshot(Object.fromEntries(Object.entries(generators).map(([name, draw]) => [name, draw(seed)])));
  });

  it("survives degenerate boxes", () => {
    for (const [w, h] of [[0, 0], [1, 1], [2, 40], [40, 2], [10, 30]]) {
      const out = JSON.stringify([
        ink.boxStroke(seed, w, h),
        ink.crossedBoxStroke(seed, w, h),
        ink.shadeFill(seed, w, h),
        ink.hatchStrokes(seed, w, h),
        ink.capsuleStroke(seed, w, h),
        ink.roundedBoxStroke(seed, w, h, 12),
        ink.roundedRectPath(w, h, 12),
        ink.penBoxStrokes(seed, w, h, { passes: 3 }),
        ink.chevronStroke(seed, w, h),
        ink.tickStroke(seed, w),
        ink.cornerTicks(seed, w, h),
        ink.swipePath(seed, w, h),
      ]);
      assert.doesNotMatch(out, /NaN|Infinity/, `${w}×${h}`);
    }
  });

  it("hashes seeds stably", () => {
    assert.equal(ink.hashSeed("ballpoint"), ink.hashSeed("ballpoint"));
    assert.equal(ink.hashSeed(42), ink.hashSeed("42"));
    assert.notEqual(ink.hashSeed("a"), ink.hashSeed("b"));
  });
});
