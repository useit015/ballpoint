"use client";

import { PenArt } from "@/components/art/pen-art";
import { useLazyScene } from "@/components/art/use-lazy-scene";
import { sideBox } from "@/lib/art/boxes";

/**
 * A lake under the moon and stars, or under the sun and a few clouds: the
 * scene draws both and shows the one for `side` (`.as-night`, `.as-day` in
 * art.css). It is drawn when the section is near.
 */
export function SideArt({ side }: { side: "day" | "night" }) {
  const [host, scene] = useLazyScene(() => import("@/lib/art/side").then((m) => m.sideScene()), "900px 0px");
  return (
    <div ref={host} style={{ aspectRatio: `${sideBox[0]} / ${sideBox[1]}` }}>
      {scene && <PenArt scene={scene} view label={side === "night" ? "A moon over a lake, drawn in pen" : "The sun over a lake, drawn in pen"} />}
    </div>
  );
}
