"use client";

import { useEffect, useRef, useState } from "react";
import type { Scene } from "@/lib/art/kit";

/**
 * A scene drawn only when its place on the page comes near: `load` fetches
 * the generator (a chunk of its own) and makes the scene, in an idle moment.
 * Attach the ref to the box that holds the place; nothing in the HTML grows.
 */
export function useLazyScene(load: () => Promise<Scene>, rootMargin = "1000px 0px") {
  const host = useRef<HTMLDivElement>(null);
  const [scene, setScene] = useState<Scene | null>(null);
  const loader = useRef(load);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let cancelled = false;
    const seen = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        seen.disconnect();
        loader.current().then((made) => {
          const show = () => !cancelled && setScene(made);
          if (typeof requestIdleCallback === "function") requestIdleCallback(show, { timeout: 600 });
          else setTimeout(show, 50);
        });
      },
      { rootMargin },
    );
    seen.observe(el);
    return () => {
      cancelled = true;
      seen.disconnect();
    };
  }, [rootMargin]);
  return [host, scene] as const;
}
