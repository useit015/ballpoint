"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { hashSeed, lineStroke, loopStroke } from "@/registry/ballpoint/lib/ink-sketch";

// Sun: a small loop and eight rays. Moon: a crescent in one pull.
const sunCore = loopStroke(hashSeed("sun"), 8, 8, { pad: 0, turns: 1.08 });
const sunRays = Array.from({ length: 8 }, (_, i) => {
  const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
  return lineStroke(hashSeed(`ray-${i}`), [4 + Math.cos(a) * 7, 4 + Math.sin(a) * 7], [4 + Math.cos(a) * 9.6, 4 + Math.sin(a) * 9.6], {
    bow: 0,
    jitter: 0.25,
  });
});
const moon = "M6.6 -3.6C2 -3.5 -1.2 0.4 -0.6 4.6C0 8.6 3.6 11.4 7.8 11C9.8 10.8 11.3 9.9 12.3 8.6C8.6 9.3 5.2 7 4.4 3.4C3.8 0.6 4.8 -2 6.6 -3.6Z";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const isDark = () => document.documentElement.classList.contains("dark");

export function ThemeToggle() {
  const dark = useSyncExternalStore(subscribe, isDark, () => false);
  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={() => {
        const next = !isDark();
        document.documentElement.classList.toggle("dark", next);
        try {
          localStorage.setItem("theme", next ? "dark" : "light");
        } catch {}
      }}
    >
      <svg aria-hidden="true" viewBox="-6 -6 20 20" className="ink-sketch relative size-5">
        {dark ? (
          <path d={moon} />
        ) : (
          <>
            <path d={sunCore} />
            {sunRays.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </>
        )}
      </svg>
    </Button>
  );
}
