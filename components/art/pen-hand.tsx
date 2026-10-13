"use client";

import { useEffect, useRef } from "react";
import { penShape } from "@/lib/art/doodles";
import { UNIT } from "@/lib/art/kit";

type Lead = { el: SVGPathElement; at: number; dur: number; len: number; from: DOMPoint; to: DOMPoint };

const ease = (t: number) => t * t * (3 - 2 * t);

/**
 * The pen that draws the picture: a small ballpoint at the tip of each stroke
 * marked "lead" (the outlines the picture is built on), riding it as the CSS
 * dash runs, and hopping from one to the next. It reads the strokes' own
 * timing and the dash's live offset, so it is never ahead of the ink or
 * behind it; when the last outline is down it lifts away. It is only a
 * flourish: the picture draws without it, and it does not show under
 * reduced motion.
 */
export function PenHand({ box }: { box: readonly [number, number] }) {
  const svg = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const layer = svg.current;
    const art = layer?.closest<HTMLElement>(".art");
    const pen = layer?.querySelector<SVGGElement>(".art-pen");
    if (!layer || !art || !pen || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let leads: Lead[] = [];
    let raf = 0;
    let base: number | null = null;
    let started = 0;
    const vbWide = box[0] * UNIT;

    const gather = () => {
      leads = [...art.querySelectorAll<SVGPathElement>("path.lead")]
        .map((el) => {
          const len = el.getTotalLength();
          return { el, at: parseFloat(el.style.getPropertyValue("--dd")), dur: parseFloat(el.style.getPropertyValue("--d")), len, from: el.getPointAtLength(0), to: el.getPointAtLength(len) };
        })
        .sort((a, b) => a.at - b.at);
    };

    const place = (x: number, y: number, lift: number, opacity: number) => {
      // The pen is drawn in pixels: scale it to the picture's units, to about the length of a finger.
      const px = Math.min(66, Math.max(46, art.clientWidth * 0.08));
      const k = (vbWide / art.clientWidth) * (px / 64);
      pen.setAttribute("transform", `translate(${(x + lift * 0.5).toFixed(1)} ${(y - lift).toFixed(1)}) rotate(26) scale(${k.toFixed(4)})`);
      pen.style.opacity = String(opacity);
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (base === null) {
        const anim = leads[0].el.getAnimations()[0];
        if (anim?.startTime == null) {
          // No stroke has started yet (the picture waits to be seen), or this one is long over.
          if (++started > 600) cancelAnimationFrame(raf);
          return;
        }
        base = Number(anim.startTime);
      }
      const e = Number(document.timeline.currentTime) - base;
      const first = leads[0];
      const last = leads[leads.length - 1];
      const px = art.clientWidth / vbWide;
      if (e < first.at - 200) return void (pen.style.opacity = "0");
      if (e < first.at) {
        // The pen comes down onto where the first stroke starts.
        const t = ease(1 - (first.at - e) / 200);
        return place(first.from.x, first.from.y, ((1 - t) * 40) / px, t);
      }
      if (e > last.at + last.dur) {
        const t = (e - last.at - last.dur) / 520;
        if (t >= 1) {
          pen.style.opacity = "0";
          return cancelAnimationFrame(raf);
        }
        return place(last.to.x, last.to.y, (ease(t) * 70) / px, 1 - t);
      }
      let i = leads.length - 1;
      while (i > 0 && leads[i].at > e) i--;
      const lead = leads[i];
      if (e <= lead.at + lead.dur) {
        // On a stroke: the tip is where the dash has got to.
        const offset = parseFloat(getComputedStyle(lead.el).strokeDashoffset);
        const tip = Math.min(1, Math.max(0, 1.05 - (Number.isNaN(offset) ? 1.05 : offset)));
        const at = lead.el.getPointAtLength(tip * lead.len);
        return place(at.x, at.y, 0, 1);
      }
      // Between two: the pen lifts, crosses, and comes down.
      const next = leads[i + 1];
      const t = Math.min(1, (e - lead.at - lead.dur) / Math.max(1, next.at - lead.at - lead.dur));
      const s = ease(t);
      place(lead.to.x + (next.from.x - lead.to.x) * s, lead.to.y + (next.from.y - lead.to.y) * s, (Math.sin(Math.PI * t) * 18) / px, 1);
    };

    const go = () => {
      cancelAnimationFrame(raf);
      gather();
      if (!leads.length) return;
      base = null;
      started = 0;
      raf = requestAnimationFrame(frame);
    };
    const observer = new MutationObserver(() => art.hasAttribute("data-run") && go());
    if (art.hasAttribute("data-run")) go();
    else observer.observe(art, { attributes: true, attributeFilter: ["data-run"] });
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [box]);

  return (
    <svg ref={svg} viewBox={`0 0 ${box[0] * UNIT} ${box[1] * UNIT}`} data-z={0} className="art-layer art-pen-layer" focusable="false" aria-hidden="true">
      <g className="art-pen">
        <path d={penShape.barrel} />
        <path d={penShape.clip} />
        <path d={penShape.clicker} />
        <path d={penShape.tip} className="art-pen-ink" />
        <path d={penShape.lines} className="art-pen-line" />
      </g>
    </svg>
  );
}
