"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { birdPoses } from "@/lib/art/creatures";

export type Bird = {
  x: number;
  y: number;
  /** Half the wingspan, in units. */
  s: number;
  /** Where it flies to over its crossing, from where it is. */
  to: [number, number];
  /** Seconds for the crossing, and into it. */
  dur: number;
  delay: number;
  /** Seconds a flap takes. */
  beat: number;
};

/**
 * Birds crossing the sky, each flapping through the four beats of its wings
 * (level, up, level, down) and drifting across slowly. A pointer passing over
 * one startles the lot: they beat hard and go, and in a few seconds come
 * back. Only for the pointer: it is a thing to find, not a thing to do.
 */
export function Birds({ birds }: { birds: Bird[] }) {
  const [scared, setScared] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const scare = () => {
    if (scared) return;
    setScared(true);
    timer.current = setTimeout(() => setScared(false), 6400);
  };
  return (
    <g className="flock" aria-hidden="true" data-scared={scared ? "" : undefined}>
      {birds.map((b, i) => {
        const poses = birdPoses(b.s);
        const style = {
          "--tx": `${b.to[0]}px`,
          "--ty": `${b.to[1]}px`,
          "--dur": `${b.dur}s`,
          "--delay": `${b.delay}s`,
          "--beat": `${b.beat}s`,
          "--ex": `${(i % 2 ? 1 : -1) * (50 + i * 30)}px`,
          "--ey": `${-80 - i * 22}px`,
        } as CSSProperties;
        return (
          <g key={i} transform={`translate(${b.x} ${b.y})`}>
            <g className="fly" style={style}>
              <g className="wings">
                {poses.map((d, k) => (
                  <path key={k} d={d} className={`pose p${k}`} style={{ "--i": k, "--w": 1.05 } as CSSProperties} />
                ))}
              </g>
              <rect className="hit" x={-b.s * 1.5} y={-b.s * 1.5} width={b.s * 3} height={b.s * 2.4} onPointerEnter={scare} onPointerDown={scare} />
            </g>
          </g>
        );
      })}
    </g>
  );
}
