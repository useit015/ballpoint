"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { InkProvider } from "@/registry/ballpoint/hooks/use-ink-box";

const RedrawContext = createContext<{ salt: number; redraw: () => void }>({ salt: 0, redraw: () => {} });

/**
 * The front page in one hand, which the hero's button can swap for another:
 * a new salt redraws every seed beneath, and remounting plays the drawing
 * again from the top.
 */
export function Redraw({ children }: { children: ReactNode }) {
  const [salt, setSalt] = useState(0);
  const redraw = useCallback(() => setSalt((s) => s + 1), []);
  return (
    <RedrawContext value={{ salt, redraw }}>
      <InkProvider key={salt} salt={salt || undefined}>
        {children}
      </InkProvider>
    </RedrawContext>
  );
}

export const useRedraw = () => useContext(RedrawContext);
