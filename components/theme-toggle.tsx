"use client";

import { InkThemeToggle } from "@/registry/ballpoint/ui/ink-theme-toggle";

/** The site's day/night switch: the registry's InkThemeToggle. */
export function ThemeToggle() {
  return <InkThemeToggle seed="site-theme" />;
}
