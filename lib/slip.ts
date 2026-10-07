import type { CSSProperties } from "react";
import { createRng, hashSeed } from "@/registry/ballpoint/lib/ink-sketch";

// Slips of paper laid on the page are not all the same sheet: some are ruled,
// some caught a coffee ring, one has a dog-eared corner, one is held down
// with a strip of tape. Which is decided by the slip's own key, so every slip
// keeps its paper from render to render and a page never reshuffles.

const kinds = [
  "plain", "plain", "plain", "plain",
  "ruled", "ruled", "ruled",
  "stained", "stained",
  "folded",
  "taped",
] as const;

export type SlipKind = (typeof kinds)[number];

/** The data attribute and seeded offsets for a slip; spread onto the slip's element. */
export function slipProps(key: string, { allow }: { allow?: readonly SlipKind[] } = {}): { "data-slip": SlipKind; style: CSSProperties } {
  const seed = hashSeed(`slip-${key}`);
  const r = createRng(seed);
  const pool = allow ? kinds.filter((k) => allow.includes(k)) : kinds;
  const kind = pool[seed % pool.length];
  const right = r() < 0.5;
  const low = r() < 0.5;
  return {
    "data-slip": kind,
    style: {
      // Where a stain sits (a corner, half off the sheet), and how it lies.
      "--slip-x": `${right ? 84 + r() * 14 : 2 + r() * 14}%`,
      "--slip-y": `${low ? 78 + r() * 18 : 6 + r() * 16}%`,
      "--slip-rot": `${Math.round(r() * 360)}deg`,
      "--slip-size": `${6 + r() * 3.5}rem`,
      // Tape lands anywhere along the top, a little askew.
      "--tape-x": `${30 + r() * 38}%`,
      "--tape-rot": `${(r() - 0.5) * 9}deg`,
    } as CSSProperties,
  };
}
