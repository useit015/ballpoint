"use client";

import { useLayoutEffect, useRef, useState } from "react";

export type InkSize = readonly [number, number];

// One ResizeObserver for every drawn box on the page. An element can carry
// several overlays, so each keeps its own set of listeners.
const listeners = new WeakMap<Element, Set<(size: InkSize) => void>>();
let observer: ResizeObserver | undefined;

function observe(el: Element, onSize: (size: InkSize) => void) {
  observer ??= new ResizeObserver((entries) => {
    for (const entry of entries) {
      const box = entry.borderBoxSize?.[0];
      const size: InkSize = box ? [box.inlineSize, box.blockSize] : [entry.contentRect.width, entry.contentRect.height];
      listeners.get(entry.target)?.forEach((fn) => fn(size));
    }
  });
  let set = listeners.get(el);
  if (!set) {
    set = new Set();
    listeners.set(el, set);
    observer.observe(el);
  }
  set.add(onSize);
  return () => {
    set.delete(onSize);
    if (set.size) return;
    listeners.delete(el);
    observer?.unobserve(el);
  };
}

/**
 * The size of the element an ink overlay is drawn around (the SVG's
 * parent), so strokes can be regenerated for the real box as fonts swap in,
 * text wraps, or the layout resizes.
 *
 * The server and the first client render use `estimate`, stretched to fit,
 * so there is never an empty frame. Sizes snap to `step` px, so a box that
 * is animating its size redraws every few pixels rather than every frame.
 */
export function useInkBox(estimate: InkSize, { step = 2 }: { step?: number } = {}) {
  const ref = useRef<SVGSVGElement | null>(null);
  const [size, setSize] = useState<InkSize>(estimate);

  useLayoutEffect(() => {
    const svg = ref.current;
    const el = svg?.parentElement;
    if (!svg || !el) return;
    const snap = (v: number) => Math.max(step, Math.round(v / step) * step);
    const update = ([w, h]: InkSize) => {
      if (!w || !h) return;
      const next: InkSize = [snap(w), snap(h)];
      setSize((prev) => (prev[0] === next[0] && prev[1] === next[1] ? prev : next));
    };
    update([el.offsetWidth, el.offsetHeight]);
    // Once a stroke has drawn itself in, drop its dash pattern: it looks the
    // same, but guarantees a fresh paint (Chrome can leave a small SVG on an
    // early frame of a dash animation) and stops paying for dash geometry.
    const settle = (e: AnimationEvent) => {
      if (e.animationName === "ink-draw" && e.target instanceof SVGElement) e.target.classList.add("ink-drawn");
    };
    svg.addEventListener("animationend", settle);
    const unobserve = observe(el, update);
    return () => {
      unobserve();
      svg.removeEventListener("animationend", settle);
    };
  }, [step]);

  return [ref, size] as const;
}

/**
 * An overlay frame for useInkBox: the measured size, plus the props that
 * place an InkSvg `pad` px outside its element on every side (room for
 * overshooting corners and shadows), stretched so it always covers it:
 *   <InkSvg ref={ref} {...frame}>
 */
export function useInkFrame(estimate: InkSize, { pad = 10, step = 2 }: { pad?: number; step?: number } = {}) {
  const [ref, [w, h]] = useInkBox(estimate, { step });
  return {
    ref,
    w,
    h,
    /** Spread onto the InkSvg alongside `ref`. */
    frame: {
      box: [-pad, -pad, w + pad * 2, h + pad * 2] as const,
      stretch: true,
      style: { left: -pad, top: -pad, width: `calc(100% + ${pad * 2}px)`, height: `calc(100% + ${pad * 2}px)` },
    },
  };
}
