"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** The site footer everywhere but the front page, which ends with a footer of its own. */
export function FooterSlot({ children }: { children: ReactNode }) {
  return usePathname() === "/" ? null : children;
}
