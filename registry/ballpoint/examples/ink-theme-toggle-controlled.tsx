"use client";

import { useState } from "react";
import { InkThemeToggle } from "@/registry/ballpoint/ui/ink-theme-toggle";

// Theme owned by you (or by next-themes): the toggle only reports clicks.
// This copy is a local pretend, so the page itself doesn't change.
export default function InkThemeToggleControlled() {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return (
    <div className="flex flex-col items-center gap-3">
      <InkThemeToggle theme={theme} onThemeChange={setTheme} variant="outline" seed="ttc-toggle" />
      <p className="text-sm text-ink-3">
        Your state says <span className="font-bold text-ink">{theme}</span>.
      </p>
    </div>
  );
}
