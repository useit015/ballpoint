"use client";

import { useMemo, type CSSProperties } from "react";
import { useInkBox, useInkSeed } from "@/registry/ballpoint/hooks/use-ink-box";
import { InkSvg, Stroke } from "@/registry/ballpoint/lib/ink";
import { createRng, handCurve } from "@/registry/ballpoint/lib/ink-sketch";

type P = readonly [number, number];

/**
 * An arrow pulled by hand from one point to another inside a w×h box,
 * bowed to one side, with its head flicked on at the end: for notes in the
 * margin that point at what they're about. Drawn as it scrolls into view.
 */
export function PenArrow({
  from,
  to,
  size,
  bend = 0.35,
  delay = 0,
  seed,
  className,
  style,
}: {
  from: P;
  to: P;
  /** The drawing's box, [w, h], with `from` and `to` inside it. */
  size: readonly [number, number];
  /** How far the line bows, and to which side (negative: the other). */
  bend?: number;
  delay?: number;
  seed?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const s = useInkSeed(seed);
  const [ref] = useInkBox(size);
  const { line, head } = useMemo(() => {
    const r = createRng(s);
    const [dx, dy] = [to[0] - from[0], to[1] - from[1]];
    const len = Math.hypot(dx, dy) || 1;
    const [nx, ny] = [-dy / len, dx / len];
    const mid: P = [from[0] + dx * 0.5 + nx * bend * len * 0.3, from[1] + dy * 0.5 + ny * bend * len * 0.3];
    // The head trails back along the way the line arrives.
    const back = Math.atan2(mid[1] - to[1], mid[0] - to[0]);
    const wing = (turn: number): P => [to[0] + Math.cos(back + turn) * (7 + r()), to[1] + Math.sin(back + turn) * (7 + r())];
    const [a, b] = [wing(0.52 + r() * 0.1), wing(-0.48 - r() * 0.1)];
    return {
      line: handCurve(s, [from, mid, to], { jitter: 0.6 }),
      head: `M${a[0].toFixed(1)} ${a[1].toFixed(1)}L${to[0].toFixed(1)} ${to[1].toFixed(1)}L${b[0].toFixed(1)} ${b[1].toFixed(1)}`,
    };
  }, [s, from, to, bend]);

  return (
    <InkSvg ref={ref} pending box={[0, 0, size[0], size[1]]} className={className} style={{ width: size[0], height: size[1], ...style }}>
      <Stroke d={line} draw="auto" delay={delay} duration={420} width={1.3} />
      <Stroke d={head} draw="auto" delay={delay + 380} duration={160} width={1.3} />
    </InkSvg>
  );
}
