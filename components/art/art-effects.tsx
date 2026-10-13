"use client";

import { useEffect, useRef } from "react";

/**
 * The only script a pen drawing needs, and it is optional: the picture is
 * complete without it. It lets go of each stroke's dash once drawn (so it
 * paints as one plain stroke), starts the pen when the drawing scrolls into
 * view (`view`), pauses what loops while it is off screen, and, with a
 * mouse, drifts the depths a little apart as the pointer moves (`parallax`).
 */
export function ArtEffects({ view = false, parallax = false }: { view?: boolean; parallax?: boolean }) {
  const mark = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const art = mark.current?.parentElement;
    if (!art) return;
    const cleanup: (() => void)[] = [];

    const settle = (e: AnimationEvent) => {
      if (e.target instanceof SVGPathElement && e.animationName.startsWith("art-")) e.target.classList.add("done");
    };
    art.addEventListener("animationend", settle);
    // What finished before this script got here has nobody to tell it so.
    for (const anim of art.getAnimations({ subtree: true })) {
      const el = (anim.effect as KeyframeEffect | null)?.target;
      if (anim.playState === "finished" && el instanceof SVGPathElement && (anim as CSSAnimation).animationName?.startsWith("art-")) el.classList.add("done");
    }
    cleanup.push(() => art.removeEventListener("animationend", settle));

    // On screen or not: loops (birds, stars) only run while it's seen.
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          art.setAttribute("data-seen", "");
          if (view) art.setAttribute("data-run", "");
        } else art.removeAttribute("data-seen");
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    seen.observe(art);
    cleanup.push(() => seen.disconnect());

    const fine = matchMedia("(hover: hover) and (pointer: fine)");
    const calm = matchMedia("(prefers-reduced-motion: reduce)");
    if (parallax && fine.matches && !calm.matches) {
      const host = art.closest<HTMLElement>("[data-parallax-host]") ?? art;
      let frame = 0;
      let nx = 0;
      let ny = 0;
      const move = (e: PointerEvent) => {
        const box = art.getBoundingClientRect();
        nx = Math.max(-1, Math.min(1, (e.clientX - (box.left + box.width / 2)) / (innerWidth / 2)));
        ny = Math.max(-1, Math.min(1, (e.clientY - (box.top + box.height / 2)) / (innerHeight / 2)));
        if (!frame)
          frame = requestAnimationFrame(() => {
            frame = 0;
            art.style.setProperty("--px", nx.toFixed(3));
            art.style.setProperty("--py", ny.toFixed(3));
          });
      };
      const leave = () => {
        art.style.setProperty("--px", "0");
        art.style.setProperty("--py", "0");
      };
      host.addEventListener("pointermove", move, { passive: true });
      host.addEventListener("pointerleave", leave);
      art.setAttribute("data-parallax", "");
      cleanup.push(() => {
        host.removeEventListener("pointermove", move);
        host.removeEventListener("pointerleave", leave);
        cancelAnimationFrame(frame);
        art.removeAttribute("data-parallax");
      });
    }
    return () => cleanup.forEach((fn) => fn());
  }, [view, parallax]);
  return <span ref={mark} hidden />;
}
