// The front page reads what's drawn on it: these are the shapes a hand
// makes, a little shaky, and what each should be read as.

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { recognize, type Point } from "../../components/landing/recognize.ts";

// A steady hand's tremor, the same every run.
function shaky(points: Point[], amount = 1.2, seed = 7): Point[] {
  let s = seed;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647 - 0.5) * 2 * amount;
  return points.map((p) => ({ x: p.x + r(), y: p.y + r() }));
}

function along(a: Point, b: Point, n: number): Point[] {
  return Array.from({ length: n }, (_, i) => ({
    x: a.x + ((b.x - a.x) * i) / n,
    y: a.y + ((b.y - a.y) * i) / n,
  }));
}

function rect(x: number, y: number, w: number, h: number, { overshoot = 6 } = {}): Point[] {
  const c = [
    { x, y },
    { x: x + w, y },
    { x: x + w, y: y + h },
    { x, y: y + h },
    { x, y: y - overshoot },
  ];
  return shaky([...along(c[0], c[1], 30), ...along(c[1], c[2], 12), ...along(c[2], c[3], 30), ...along(c[3], c[4], 13), c[4]]);
}

function ellipse(cx: number, cy: number, rx: number, ry: number, turns = 1.1): Point[] {
  const n = 80;
  return shaky(
    Array.from({ length: n + 1 }, (_, i) => {
      const a = -Math.PI * 0.7 + (i / n) * turns * Math.PI * 2;
      const k = 1 - (i / n) * 0.06;
      return { x: cx + Math.cos(a) * rx * k, y: cy + Math.sin(a) * ry * k };
    }),
  );
}

function scribble(x: number, y: number, w: number, h: number): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i <= 10; i++) pts.push(...along({ x: x + (i * w) / 10, y: i % 2 ? y + h : y }, { x: x + ((i + 1) * w) / 10, y: i % 2 ? y : y + h }, 6));
  return shaky(pts);
}

function tilt(points: Point[], deg: number): Point[] {
  const a = (deg * Math.PI) / 180;
  return points.map((p) => ({ x: p.x * Math.cos(a) - p.y * Math.sin(a), y: p.x * Math.sin(a) + p.y * Math.cos(a) }));
}

function roundedRect(w: number, h: number, r: number): Point[] {
  const pts: Point[] = [{ x: r, y: 0 }];
  for (const [cx, cy, from] of [
    [w - r, r, -90],
    [w - r, h - r, 0],
    [r, h - r, 90],
    [r, r, 180],
  ]) {
    for (let i = 0; i <= 6; i++) {
      const a = ((from + i * 15) * Math.PI) / 180;
      pts.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r });
    }
  }
  return shaky([...pts, { x: r + 4, y: -2 }], 1);
}

const kind = (points: Point[]) => recognize(points)?.kind;

describe("recognize", () => {
  it("ignores a tap", () => {
    assert.equal(recognize([{ x: 10, y: 10 }]), null);
    assert.equal(recognize(along({ x: 10, y: 10 }, { x: 13, y: 12 }, 4)), null);
  });

  it("reads boxes, wide and square", () => {
    assert.equal(kind(rect(40, 40, 190, 56)), "box");
    assert.equal(kind(rect(40, 40, 120, 120)), "box");
    assert.equal(kind(rect(0, 0, 300, 40, { overshoot: 2 })), "box");
    assert.equal(kind(rect(0, 0, 28, 28, { overshoot: 3 })), "box");
  });

  it("reads boxes drawn crooked, rounded or left open at the last corner", () => {
    assert.equal(kind(tilt(rect(0, 0, 260, 34), 4)), "box");
    assert.equal(kind(tilt(rect(0, 0, 100, 100), 8)), "box");
    assert.equal(kind(roundedRect(180, 56, 16)), "box");
    assert.equal(kind(rect(0, 0, 170, 50, { overshoot: -2 })), "box");
    assert.equal(kind(shaky(rect(0, 0, 120, 40), 2.5, 11)), "box");
  });

  it("reads loops, round and long, closed or overlapping", () => {
    assert.equal(kind(ellipse(100, 100, 60, 60)), "loop");
    assert.equal(kind(ellipse(100, 100, 140, 40)), "loop");
    assert.equal(kind(ellipse(100, 100, 80, 30, 1.02)), "loop");
    assert.equal(kind(ellipse(100, 100, 80, 30, 1.6)), "loop");
    assert.equal(kind(ellipse(100, 100, 60, 18)), "loop");
    assert.equal(kind(tilt(ellipse(100, 100, 90, 40), 12)), "loop");
  });

  it("doesn't take a line drawn there and back for a shape", () => {
    assert.equal(kind(shaky([...along({ x: 0, y: 0 }, { x: 200, y: 3 }, 30), ...along({ x: 200, y: 3 }, { x: 0, y: 6 }, 30)])), "doodle");
  });

  it("reads level lines, not steep ones", () => {
    assert.equal(kind(shaky(along({ x: 0, y: 50 }, { x: 260, y: 58 }, 40))), "line");
    assert.equal(kind(shaky(along({ x: 260, y: 50 }, { x: 0, y: 44 }, 40))), "line");
    assert.equal(kind(shaky(along({ x: 0, y: 0 }, { x: 80, y: 160 }, 40))), "doodle");
  });

  it("reads a tick", () => {
    const tick = shaky([...along({ x: 0, y: 20 }, { x: 14, y: 40 }, 10), ...along({ x: 14, y: 40 }, { x: 52, y: -10 }, 22), { x: 52, y: -10 }], 0.6);
    assert.equal(kind(tick), "check");
  });

  it("reads a scribble", () => {
    assert.equal(kind(scribble(0, 0, 120, 30)), "scribble");
    // Once across, the way words are crossed out; then over and back again.
    const across: Point[] = [];
    for (let i = 0; i <= 10; i++) across.push({ x: i * 32, y: i % 2 ? 48 : 12 });
    assert.equal(kind(shaky(across.flatMap((p, i) => (i ? along(across[i - 1], p, 6) : [])))), "scribble");
    assert.equal(kind([...scribble(0, 0, 200, 40), ...scribble(0, 0, 200, 40).reverse()]), "scribble");
  });

  it("leaves everything else as a doodle", () => {
    const wave = shaky(
      Array.from({ length: 80 }, (_, i) => ({
        x: i * 3,
        y: Math.sin(i / 5) * 20,
      })),
    );
    assert.equal(kind(wave), "doodle");
    const cup = shaky([
      ...along({ x: 0, y: 0 }, { x: 0, y: 80 }, 20),
      ...along({ x: 0, y: 80 }, { x: 80, y: 80 }, 20),
      ...along({ x: 80, y: 80 }, { x: 80, y: 0 }, 20),
    ]);
    assert.equal(kind(cup), "doodle");
  });
});
