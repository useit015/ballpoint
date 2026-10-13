"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * The index's own scroll box: no scrollbar (the margin line is the edge),
 * and a soft fade at whichever end has more beyond it. When it has been
 * scrolled to its end the wheel carries on into the page.
 */
export function SideScroll({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const mark = () => {
      el.toggleAttribute("data-top", el.scrollTop > 4);
      el.toggleAttribute("data-bottom", el.scrollTop + el.clientHeight < el.scrollHeight - 4);
    };
    mark();
    el.addEventListener("scroll", mark, { passive: true });
    const watch = new ResizeObserver(mark);
    watch.observe(el);
    return () => {
      el.removeEventListener("scroll", mark);
      watch.disconnect();
    };
  }, []);
  return (
    <div ref={box} data-scroll="" className="docs-scroll">
      {children}
    </div>
  );
}
