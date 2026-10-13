"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Runs `tick` every frame, but only while the drawing is on screen and the
 * tab is showing, and never under reduced motion. `dt` is seconds since the
 * last frame, held to a twentieth so a tab that was away does not leap.
 */
export function useLoop(host: RefObject<Element | null>, tick: (dt: number, t: number) => void) {
  const fn = useRef(tick);
  useEffect(() => {
    fn.current = tick;
  });
  useEffect(() => {
    const el = host.current?.closest(".art") ?? host.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = 0;
    let clock = 0;
    let seen = false;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      clock += dt;
      fn.current(dt, clock);
    };
    const sync = () => {
      const run = seen && !document.hidden;
      if (run && !raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      } else if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        seen = entry.isIntersecting;
        sync();
      },
      { rootMargin: "80px" },
    );
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      cancelAnimationFrame(raf);
    };
  }, [host]);
}
