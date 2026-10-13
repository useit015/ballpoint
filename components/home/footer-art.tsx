"use client";

import dynamic from "next/dynamic";
import { PenArt } from "@/components/art/pen-art";
import { useLazyScene } from "@/components/art/use-lazy-scene";
import { footerBox } from "@/lib/art/boxes";

const FooterLife = dynamic(() => import("@/components/art/life/footer-life"), { ssr: false });

/**
 * The landscape at the foot of the page. It is far down, so its strokes are
 * not in the page's HTML: when it is a screen or so away, its generator (and
 * the people who live in it) are loaded and the picture drawn in the
 * browser, from the same seeds every time. The space is reserved, so
 * nothing moves when it arrives.
 */
export function FooterArt() {
  const [host, scene] = useLazyScene(
    () => Promise.all([import("@/lib/art/footer"), import("@/components/art/life/footer-life")]).then(([m]) => m.footerScene()),
    "1100px 0px",
  );
  return (
    <div ref={host} className="foot-art" style={{ aspectRatio: `${footerBox[0]} / ${footerBox[1]}` }}>
      {scene && <PenArt scene={scene} view pen className="foot-art-pen" life={{ 2: <FooterLife /> }} />}
    </div>
  );
}
