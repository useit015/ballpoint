"use client";

import { useEffect, useRef } from "react";
import { boatParts, fish, soft } from "@/lib/art/creatures";
import type { Piece } from "@/lib/art/kit";
import { PiecePath } from "@/components/art/piece-path";
import { Hit, Poke } from "@/components/art/life/poke";

const draw = (d: string, at: number, dur: number, w = 0.9, o?: number): Piece => ({ d, w, o, at, dur, how: "draw", z: 1 });

/**
 * A man fishing from a rowing boat, rocking on the lake and drifting slowly.
 * Press the boat and he has a bite: the rod snaps up, the bobber goes under,
 * a fish leaps and falls back, with rings where it broke the water.
 */
export function Boat({ x, y, at = 2900 }: { x: number; y: number; at?: number }) {
  const parts = boatParts();
  const f = fish();
  const rig = useRef<SVGGElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const bite = () => {
    const el = rig.current;
    if (!el) return;
    clearTimeout(timer.current);
    el.removeAttribute("data-bite");
    void el.getBoundingClientRect();
    el.setAttribute("data-bite", "");
    timer.current = setTimeout(() => el.removeAttribute("data-bite"), 3400);
  };
  // What hides the water lines behind the boat: paper in its shape.
  const hullFill = soft([[-24, -3], [-19, 2.4], [-8, 4.8], [8, 4.8], [19, 2.4], [26, -4]]) + "Z";
  const manFill = "M-3 -14.4L-5.6 -8L-4.8 -3L6.6 -3.3L7.2 0L2.6 0.6L2 -9.6L-0.4 -12.4Z";
  return (
    <Poke label="The fisherman: give him a bite" onPoke={bite} className="boat-poke">
      <g transform={`translate(${x} ${y})`}>
        <g className="boat-drift">
          <g className="boat-rock">
            <g transform="scale(1.55)" ref={rig} className="boat-rig">
              <path className="boat-fill" d={hullFill + manFill} />
              <circle className="boat-fill" cx={-3} cy={-17.2} r={2.9} />
              <PiecePath unit={1} p={draw(parts.hull, at, 520, 0.9)} />
              <PiecePath unit={1} p={draw(parts.oar, at + 380, 260, 0.75, 0.85)} />
              <PiecePath unit={1} p={draw(parts.man, at + 360, 560, 0.85)} />
              <PiecePath unit={1} p={draw(parts.arm, at + 700, 240, 0.85)} />
              <g className="rod-rig">
                <PiecePath unit={1} p={draw(parts.rod, at + 840, 420, 0.8)} />
                <PiecePath unit={1} p={draw(parts.line, at + 1200, 320, 0.45, 0.8)} />
                <PiecePath unit={1} p={draw(parts.bobber, at + 1450, 220, 0.8)} />
              </g>
              <ellipse className="ring idle" cx={30.8} cy={-1.2} rx={4} ry={1.1} />
              <ellipse className="ring splash a" cx={31} cy={-1} rx={5} ry={1.4} />
              <ellipse className="ring splash b" cx={16} cy={1} rx={5} ry={1.4} />
              <g className="fish">
                <path d={f.body} />
                <path d={f.tail} />
                <path d={f.eye} />
              </g>
              <path className="alarm" d={`${soft([[-3.6, -32.4], [-3.4, -27.4]])}M-3.3 -24.6l0.05 0.15`} />
              <path className="wake" d="M-30 7.2l12 0.4M-27 9.8l24 0.3M-12 12l22 0" />
              <Hit x={-30} y={-36} width={72} height={46} />
            </g>
          </g>
        </g>
      </g>
    </Poke>
  );
}
