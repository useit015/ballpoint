"use client";

import { Birds, type Bird } from "@/components/art/life/birds";
import { Boat } from "@/components/art/life/boat";
import { SkyPoke } from "@/components/art/life/sky";
import { Trees } from "@/components/art/life/trees";
import { lake, sky, tallPines } from "@/lib/art/boxes";

const birds: Bird[] = [
  { x: 566, y: 98, s: 9, to: [-430, -34], dur: 34, delay: 0, beat: 1.05 },
  { x: 598, y: 84, s: 7, to: [-420, -30], dur: 36, delay: 1.4, beat: 0.9 },
  { x: 540, y: 76, s: 6, to: [-380, -22], dur: 33, delay: 2.6, beat: 0.82 },
];

/** The sun (a button that turns the page to night), and birds crossing the sky. */
export function HeroSky() {
  return (
    <>
      <Birds birds={birds} />
      <SkyPoke x={sky.x} y={sky.y} />
    </>
  );
}

/** A man fishing on the lake. */
export function HeroLake() {
  return <Boat x={lake.x} y={lake.y} />;
}

/** The tall pines either side, for a pointer to set swaying. */
export function HeroTrees() {
  return <Trees trees={tallPines} />;
}
