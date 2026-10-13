// The front page's drawings are generated: a pure function of their seeds, so
// the server and the browser draw the same picture (no hydration mismatch),
// and small enough to ship. These pin what any change to a scene must keep.

import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { aim } from "../../lib/art/callout.ts";
import { arrow, paperclip, penDoodle, pineDoodle, smiley, star } from "../../lib/art/doodles.ts";
import { footerScene } from "../../lib/art/footer.ts";
import { heroScene } from "../../lib/art/hero.ts";
import { bubble, birdPoses, flameShapes } from "../../lib/art/creatures.ts";
import { heightAt, measure, poly, pulls, track, UNIT, visibleRuns, type Piece, type Scene } from "../../lib/art/kit.ts";
import { crouchFrame, footAt, sitFrames, standFrames, STRIDE, turnFrame, waveFrames, walkFrames, type Look } from "../../lib/art/people.ts";
import { sideScene } from "../../lib/art/side.ts";
import { skyline } from "../../lib/art/nature.ts";

const scenes: Record<string, { make: () => Scene; bytes: number; ends: number }> = {
  hero: { make: heroScene, bytes: 115_000, ends: 7000 },
  footer: { make: footerScene, bytes: 180_000, ends: 7000 },
  side: { make: sideScene, bytes: 50_000, ends: 5000 },
};

const pathChars = /^[MmLlQqAaZz0-9 ,.\-]+$/;

describe("art scenes", () => {
  for (const [name, { make, bytes, ends }] of Object.entries(scenes)) {
    describe(name, () => {
      const scene = make();

      it("draws the same picture every time", () => {
        assert.equal(JSON.stringify(make()), JSON.stringify(scene));
      });

      it("is made of well-formed pieces", () => {
        assert.ok(scene.pieces.length > 20);
        for (const p of scene.pieces) {
          assert.match(p.d, pathChars, `${name}: ${p.d.slice(0, 60)}`);
          assert.ok(p.d.length > 4);
          assert.ok(p.w > 0 && p.w < 4);
          assert.ok(p.dur > 0 && p.at >= 0);
          assert.ok([0, 1, 2].includes(p.z));
          assert.ok(p.how === "draw" || p.how === "sweep");
          assert.ok(p.o === undefined || (p.o > 0 && p.o <= 1));
        }
      });

      it("stays within its size budget and finishes in time", () => {
        const total = scene.pieces.reduce((n, p) => n + p.d.length, 0);
        assert.ok(total < bytes, `${name} is ${total} bytes of path`);
        const end = Math.max(...scene.pieces.filter((p) => !p.cls || !/bird|steam|stars/.test(p.cls)).map((p) => p.at + p.dur));
        assert.ok(end <= ends, `${name} is still drawing at ${Math.round(end)}ms`);
      });
    });
  }

  it("lays the outlines the pen follows one after another, none starting before the last is down", () => {
    for (const make of [heroScene, footerScene]) {
      const lead = make()
        .pieces.filter((p) => p.cls === "lead")
        .sort((a, b) => a.at - b.at);
      assert.ok(lead.length >= 3);
      for (const [i, p] of lead.entries()) {
        assert.equal(p.how, "draw");
        if (i) assert.ok(p.at >= lead[i - 1].at + lead[i - 1].dur, `a stroke starts at ${p.at}, before the one before it ends`);
      }
    }
  });

  it("gives every sweep and draw a time, and no stroke more than the picture's own end", () => {
    for (const make of [heroScene, footerScene, sideScene]) for (const p of make().pieces) assert.ok(p.at + p.dur < 8000);
  });
});

describe("doodles", () => {
  it("each fits its own box and draws", () => {
    for (const scene of [arrow("t", [0, 0], [60, 40], 0.3), smiley(), star(), pineDoodle("t", 96), paperclip(), penDoodle()]) {
      assert.ok(scene.box[0] > 0 && scene.box[1] > 0);
      assert.ok(scene.pieces.length > 0);
      for (const p of scene.pieces) assert.match(p.d, pathChars);
    }
  });
});

describe("path helpers", () => {
  it("writes straight lines relative, on the grid", () => {
    assert.equal(poly([[0, 0], [5, 2.5]]), "M0 0l10 5");
    assert.equal(pulls([[[1, 1], [2, 1]], [[3, 4], [3, 6]]]), "M2 2l2 0M6 8l0 4");
  });

  it("measures a path: how long, where it starts and where it ends", () => {
    const m = measure(poly([[0, 0], [3, 4], [3, 10]]));
    assert.ok(Math.abs(m.len - 11) < 1e-9, `${m.len}`);
    assert.deepEqual(m.start, [0, 0]);
    assert.deepEqual(m.end, [3, 10]);
    // A smooth line is as long as the pen goes: a bit more than the chord, never less.
    const arc = measure("M0 0l20 0q20 -20 40 0");
    assert.ok(arc.len > 30 && arc.len < 40, `${arc.len}`);
  });

  it("lays strokes down one after another, each as long as its length asks", () => {
    const pen = track(100, 0.5);
    const piece = (d: string): Piece => ({ d, w: 1, at: 0, dur: 0, how: "draw", z: 0 });
    const a = pen.lay(piece(poly([[0, 0], [100, 0]])));
    const b = pen.lay(piece(poly([[110, 0], [160, 0]])));
    assert.equal(a.at, 100);
    assert.equal(a.dur, 200);
    assert.ok(b.at >= a.at + a.dur);
    assert.equal(b.dur, 160);
    assert.equal(pen.end, b.at + b.dur);
  });

  it("leaves out the part of a skyline that a nearer ridge hides", () => {
    const line: [number, number][] = [[0, 10], [50, 10], [100, 10]];
    const runs = visibleRuns(line, (x) => (x > 50 ? 5 : 20));
    assert.equal(runs.length, 1);
    assert.ok(runs[0][runs[0].length - 1][0] <= 51);
  });

  it("builds a skyline that peaks where it was asked to", () => {
    const { line, y } = skyline("t", 0, 400, 300, [{ x: 200, h: 120, wl: 160, wr: 160 }], 0);
    const top = Math.min(...line.map((p) => p[1]));
    assert.ok(top < 190 && top > 170, `peak at ${top}`);
    assert.ok(Math.abs(heightAt(line, 200) - y(200)) < 1e-9);
    assert.ok(y(0) > 295);
  });
});

describe("aiming a note's arrow", () => {
  const note = { left: 100, top: 100, width: 80, height: 30 };

  it("leaves the side of the note that faces the target, and stops short of the target", () => {
    const target = { left: 400, top: 90, width: 200, height: 100 };
    const arrowTo = aim(note, target, { gap: 8 });
    assert.ok(arrowTo);
    // In the note's own coordinates: out of its right edge, to just left of the target's left edge.
    assert.ok(arrowTo.from[0] >= 80, `leaves at ${arrowTo.from[0]}`);
    assert.ok(Math.abs(arrowTo.to[0] - (400 - 100 - 8)) < 1.5, `stops at ${arrowTo.to[0]}`);
  });

  it("points at the nearest point of a target above it", () => {
    const target = { left: 80, top: -200, width: 400, height: 100 };
    const arrowTo = aim(note, target);
    assert.ok(arrowTo);
    assert.ok(arrowTo.from[1] <= 0, "leaves from the top");
    assert.ok(arrowTo.to[1] < -90, "ends at the target's lower edge");
  });

  it("aims at a given spot on the target", () => {
    const target = { left: 400, top: 0, width: 100, height: 100 };
    const arrowTo = aim(note, target, { at: [0.25, 0.5], gap: 6 });
    assert.ok(arrowTo);
    // 25% across and half way down, then a gap back toward the note.
    assert.ok(Math.abs(arrowTo.to[0] - (425 - 100)) < 8, `${arrowTo.to[0]}`);
  });

  it("draws nothing when the note is already against its target", () => {
    assert.equal(aim(note, { left: 186, top: 90, width: 40, height: 50 }), null);
  });
});

describe("people", () => {
  const look: Look = { h: 44, hat: "brim", pack: true, pole: true, seed: "t" };

  it("draws the same figure every time, in well-formed paths", () => {
    const frames = [...walkFrames(look), ...standFrames(look), ...waveFrames(look), ...sitFrames(look), crouchFrame(look), turnFrame(look)];
    assert.equal(JSON.stringify(walkFrames(look)), JSON.stringify(walkFrames(look)));
    for (const f of frames) {
      assert.match(f.near, pathChars);
      assert.match(f.far, pathChars);
      assert.ok(f.near.length > 100 && f.near.length < 1800, `${f.near.length}`);
    }
  });

  it("walks a cycle of frames that are all different", () => {
    const frames = walkFrames(look, 12);
    assert.equal(frames.length, 12);
    assert.equal(new Set(frames.map((f) => f.near)).size, 12);
  });

  it("plants a foot while the body passes over it: it slides back as fast as the body goes", () => {
    // Over a stretch of stance, the foot's travel under the hip is the body's travel, backwards.
    for (const h of [38, 44, 52]) {
      const a = footAt(h, 0.05).foot;
      const b = footAt(h, 0.4).foot;
      assert.ok(Math.abs(b[0] - a[0] + 0.35 * STRIDE * h) < 1e-6, `h ${h}`);
      assert.equal(a[1], 0);
      assert.equal(b[1], 0);
    }
  });

  it("lifts the foot that is not on the ground, and brings it down again where the next step starts", () => {
    const h = 44;
    const peak = footAt(h, 0.8).foot[1];
    assert.ok(peak > 0.05 * h, `${peak}`);
    const end = footAt(h, 0.999).foot;
    const start = footAt(h, 0.0).foot;
    assert.ok(Math.abs(end[0] - start[0]) < 0.6, `${end[0]} to ${start[0]}`);
    assert.ok(end[1] < 0.2);
  });
});

describe("creatures", () => {
  it("beats a bird's wings through four different poses", () => {
    const poses = birdPoses(8);
    assert.equal(new Set(poses).size, 4);
    for (const d of poses) assert.match(d, pathChars);
  });

  it("flickers a flame between several shapes", () => {
    const shapes = flameShapes(6, "t");
    assert.equal(new Set(shapes.map((s) => s.outer)).size, 6);
    for (const s of shapes) assert.match(s.outer + s.inner, pathChars);
  });

  it("pulls a speech bubble round its words, with a tail", () => {
    const d = bubble("t", 60, 18, 30);
    assert.match(d, pathChars);
    // (measure reads the kit's own half-unit grid; a bubble is written in whole units.)
    assert.ok(measure(d).len * UNIT > 2 * (60 + 18));
  });
});
