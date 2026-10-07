"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type TocItem = { id: string; title: string; depth?: 2 | 3 };

/** "On this page": the sections of the page, with the one being read marked. */
export function Toc({ items }: { items: TocItem[] }) {
  const [current, setCurrent] = useState(items[0]?.id);

  useEffect(() => {
    const targets = items.map((item) => document.getElementById(item.id)).filter((el): el is HTMLElement => !!el);
    // The section being read is the last one whose heading has passed the top fifth of the window.
    const update = () => {
      let id = targets[0]?.id;
      for (const el of targets) if (el.getBoundingClientRect().top <= window.innerHeight * 0.2) id = el.id;
      setCurrent(id);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [items]);

  return (
    <nav aria-label="On this page" className="flex flex-col gap-3">
      <h2 className="text-sm font-bold tracking-wider text-ink-3 uppercase">On this page</h2>
      <ul className="flex flex-col gap-1.5">
        {items.map((item) => (
          <li key={item.id} className={cn(item.depth === 3 && "pl-3")}>
            <a
              href={`#${item.id}`}
              aria-current={current === item.id ? "location" : undefined}
              className={cn("block text-sm transition-colors", current === item.id ? "font-bold text-ink" : "text-ink-3 hover:text-ink")}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
