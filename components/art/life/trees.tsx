"use client";

import { useEffect, useRef, useState, type CSSProperties, type SyntheticEvent } from "react";

export type Tree = { cx: number; base: number; h: number; fat?: number };

type Flurry = { id: number; bits: { x: number; y: number; dx: number; fall: number; delay: number }[] };

/**
 * The tall pines of a drawing, answering the pointer: one it passes over
 * sways (the group of its strokes, `.t0`, `.t1`, ... in the scene), one that
 * is pressed is shaken, and drops what it was holding. Only for the pointer:
 * it is a thing to find, not a thing to do.
 */
export function Trees({ trees, bits = 11 }: { trees: Tree[]; bits?: number }) {
  const [flurries, setFlurries] = useState<Flurry[]>([]);
  const next = useRef(1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => {
    const held = timers.current;
    return () => held.forEach(clearTimeout);
  }, []);

  const move = (e: SyntheticEvent, i: number, kind: "sway" | "shake") => {
    const g = e.currentTarget.closest(".art")?.querySelector<SVGGElement>(`.t${i}`);
    if (!g || g.hasAttribute("data-sway") || g.hasAttribute("data-shake")) return;
    g.setAttribute(`data-${kind}`, "");
    timers.current.push(setTimeout(() => g.removeAttribute(`data-${kind}`), kind === "sway" ? 1700 : 1300));
  };
  const shake = (e: SyntheticEvent, i: number) => {
    const t = trees[i];
    const g = e.currentTarget.closest(".art")?.querySelector<SVGGElement>(`.t${i}`);
    g?.removeAttribute("data-sway");
    move(e, i, "shake");
    const hw = t.h * 0.19 * (t.fat ?? 1);
    const id = next.current++;
    const list = Array.from({ length: bits }, () => {
      const u = 0.25 + Math.random() * 0.6;
      return { x: t.cx + (Math.random() * 2 - 1) * hw * (0.2 + 0.8 * u), y: t.base - t.h + t.h * u, dx: (Math.random() - 0.5) * 8, fall: 10 + Math.random() * Math.min(60, t.h * 0.45), delay: Math.random() * 0.35 };
    });
    setFlurries((all) => [...all, { id, bits: list }]);
    timers.current.push(setTimeout(() => setFlurries((all) => all.filter((f) => f.id !== id)), 2200));
  };

  return (
    <g aria-hidden="true">
      {trees.map((t, i) => {
        const hw = t.h * 0.19 * (t.fat ?? 1) * 1.05;
        return <polygon key={i} className="hit tree-hit" points={`${t.cx},${t.base - t.h} ${t.cx - hw},${t.base} ${t.cx + hw},${t.base}`} onPointerEnter={(e) => move(e, i, "sway")} onPointerDown={(e) => shake(e, i)} />;
      })}
      {flurries.map((f) =>
        f.bits.map((b, k) => (
          <path key={`${f.id}-${k}`} d="M0 0l0.5 1.7" className="fleck" transform={`translate(${b.x.toFixed(1)} ${b.y.toFixed(1)})`} style={{ "--dx": `${b.dx}px`, "--fall": `${b.fall}px`, "--delay": `${b.delay}s`, "--w": 1.1 } as CSSProperties} />
        )),
      )}
    </g>
  );
}
