"use client";

import { useId, useState, type ReactNode } from "react";
import { InkProvider } from "@/registry/ballpoint/hooks/use-ink-box";
import { Button } from "@/registry/ballpoint/ui/button";
import { DrawnFrame } from "@/components/drawn-frame";
import { cn } from "@/lib/utils";

/**
 * A live example and its code. "Redraw" hands the example a new salt and
 * remounts it, so every stroke is drawn in again by a slightly different hand.
 */
export function Preview({ children, code, className }: { children: ReactNode; code: ReactNode; className?: string }) {
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const [salt, setSalt] = useState(0);
  const id = useId();
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center justify-between gap-4">
        <div role="tablist" aria-label="Example" className="flex gap-5">
          {(["preview", "code"] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              id={`${id}-${t}-tab`}
              aria-selected={tab === t}
              aria-controls={`${id}-${t}`}
              onClick={() => setTab(t)}
              className={cn(
                "cursor-pointer border-b-2 pb-0.5 capitalize transition-colors",
                tab === t ? "border-ink text-ink" : "border-transparent text-ink-3 hover:text-ink",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        {tab === "preview" && (
          <Button variant="ghost" size="sm" onClick={() => setSalt((s) => s + 1)}>
            Redraw
          </Button>
        )}
      </div>
      <div id={`${id}-preview`} role="tabpanel" aria-labelledby={`${id}-preview-tab`} hidden={tab !== "preview"}>
        <DrawnFrame seed="preview" className="px-6 py-10 sm:px-10" data-preview="">
          <InkProvider key={salt} salt={salt === 0 ? undefined : salt}>
            {children}
          </InkProvider>
        </DrawnFrame>
      </div>
      <div id={`${id}-code`} role="tabpanel" aria-labelledby={`${id}-code-tab`} hidden={tab !== "code"}>
        {code}
      </div>
    </div>
  );
}
