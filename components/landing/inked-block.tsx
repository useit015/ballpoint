"use client";

import { useMemo, type CSSProperties, type ReactNode } from "react";
import { useInkFrame, useInkSeed } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { createRng } from "@/registry/ballpoint/lib/ink-sketch";

type P = readonly [number, number];
const n1 = (v: number) => Math.round(v * 10) / 10;

/**
 * One long stroke going up and down, leaning a little, stepping across the
 * box: the way a block is coloured in with a ballpoint in a hurry. Every
 * pull runs the same way, so neighbours lie side by side and close up
 * solid; the turns run past the top and bottom by different amounts, so
 * those edges come out ragged.
 */
function colourIn(seed: number, w: number, h: number, gap: number) {
  const r = createRng(seed);
  const lean = Math.min(h * 0.06, 26);
  // Some turns run past the edge, some stop short of it.
  const past = () => -4 + r() * 16;
  let x = -lean * 0.4;
  let down = true;
  let d = `M${n1(x + lean)} ${n1(-past())}`;
  while (x < w + gap) {
    // Down from the top of this pull, or up from its foot.
    const [from, to]: [P, P] = down ? [[x + lean, 0], [x, h + past()]] : [[x, h], [x + lean, -past()]];
    const bow = (r() - 0.5) * gap;
    d += `Q${n1((from[0] + to[0]) / 2 + bow)} ${n1(h / 2)} ${n1(to[0])} ${n1(to[1])}`;
    // Step along to the next pull, round the turn.
    x += gap * (0.8 + r() * 0.4);
    d += down ? `L${n1(x)} ${n1(h + past())}` : `L${n1(x + lean)} ${n1(-past())}`;
    down = !down;
  }
  return d;
}

/**
 * A block shaded in solid with the pen, as it scrolls into view, and the
 * page's colours turned over on top of it: paper-coloured writing on ink.
 * Whatever sits inside with .ink-land waits for the shading to finish.
 */
export function InkedBlock({ seed = "inked", className, children }: { seed?: string; className?: string; children: ReactNode }) {
  const s = useInkSeed(seed);
  const { ref, w, h, frame } = useInkFrame([1200, 440], { pad: 24, step: 8 });
  const gap = w < 640 ? 7 : 9;
  const fill = useMemo(() => colourIn(s, w, h, gap), [s, w, h, gap]);
  // About a second and a half across a wide block, a little less on a phone.
  const takes = Math.round(900 + Math.min(w, 1400) * 0.5);

  return (
    <div data-ink-stage="" className={`inked relative isolate ${className ?? ""}`} style={{ "--inked-takes": `${takes}ms` } as CSSProperties}>
      <InkSvg ref={ref} {...frame} pending className="-z-10 text-ink">
        <Stroke d={fill} draw="auto" duration={takes} width={gap * 1.6} />
      </InkSvg>
      <div data-ink-scope="" className="inked-face relative">
        {children}
      </div>
    </div>
  );
}
