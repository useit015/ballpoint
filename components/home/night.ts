"use client";

import { useSyncExternalStore } from "react";
import { blotPath } from "@/registry/ballpoint/lib/ink-sketch";

// Changing how the whole page looks (day or night, which pen, which paper),
// from anywhere on it: the same ink blot the header's InkThemeToggle makes,
// spreading from whatever was flipped (styles/ink-theme-toggle.css draws it).

const blot = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><path d='${blotPath(11)}'/></svg>`)}")`;

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}
const isNight = () => document.documentElement.classList.contains("dark");

/** Whether the page is at night, following the header's toggle too. */
export function useNight() {
  return useSyncExternalStore(subscribe, isNight, () => false);
}

let running: ViewTransition | undefined;

/**
 * Change the page with `apply` (it must change the DOM before it returns),
 * the new look spreading out from `from` like ink. Without view transitions,
 * or under reduced motion, it just changes.
 */
export async function inkBlot(apply: () => void, from: Element) {
  const root = document.documentElement;
  running?.skipTransition();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches || typeof document.startViewTransition !== "function") return apply();

  const box = from.getBoundingClientRect();
  const x = box.left + box.width / 2;
  const y = box.top + box.height / 2;
  // The blot's body covers about 36% of its box, so the box has to reach
  // about 2.9× the farthest corner of the viewport.
  const far = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  root.style.setProperty("--ink-theme-x", `${x}px`);
  root.style.setProperty("--ink-theme-y", `${y}px`);
  root.style.setProperty("--ink-theme-reach", `${Math.ceil(far * 2.9)}px`);
  root.style.setProperty("--ink-blot", blot);
  root.dataset.inkThemeTransition = isNight() ? "dark" : "light";
  let transition: ViewTransition | undefined;
  try {
    transition = document.startViewTransition(apply);
    running = transition;
    await transition.ready;
    root.dataset.inkThemeAnimating = "";
    await transition.finished;
  } catch {
    if (!transition) apply();
  } finally {
    if (running === transition) {
      root.removeAttribute("data-ink-theme-animating");
      root.removeAttribute("data-ink-theme-transition");
      running = undefined;
    }
  }
}

/** Turn the page to night (or day), the ink spreading out from `from`. */
export function setNight(night: boolean, from: Element) {
  return inkBlot(() => {
    document.documentElement.classList.toggle("dark", night);
    try {
      localStorage.setItem("theme", night ? "dark" : "light");
    } catch {}
  }, from);
}
