import type { CSSProperties } from "react";
import { PenArt } from "@/components/art/pen-art";
import type { Scene } from "@/lib/art/kit";

/** A small drawing for a margin: its scene at `scale` px a unit, drawn when it comes into view. */
export function Doodle({ scene, scale = 1, className, run = false, style }: { scene: Scene; scale?: number; className?: string; run?: boolean; style?: CSSProperties }) {
  return <PenArt scene={scene} scale={scale} view={!run} className={className} style={style} />;
}
