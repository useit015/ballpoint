"use client";

import { useState, type ReactNode } from "react";
import { InkProvider } from "@/registry/ballpoint/hooks/use-ink-box";
import { Button } from "@/registry/ballpoint/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ballpoint/ui/tabs";
import { cn } from "@/lib/utils";
import { slipProps } from "@/lib/slip";

/**
 * A live example and its code. "Redraw" hands the example a new salt and
 * remounts it, so every stroke is drawn in again by a slightly different hand.
 */
export function Preview({ children, code, className, seed }: { children: ReactNode; code: ReactNode; className?: string; seed?: string }) {
  const [tab, setTab] = useState("preview");
  const [salt, setSalt] = useState(0);
  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as string)} className={cn("gap-4", className)}>
      <div className="flex items-center justify-between gap-4">
        <TabsList variant="line" aria-label="Example">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        {tab === "preview" && (
          <Button variant="ghost" size="sm" seed="redraw" onClick={() => setSalt((s) => s + 1)}>
            Redraw
          </Button>
        )}
      </div>
      <TabsContent value="preview" keepMounted>
        {/* Every example sits centred on the same cream slip as the code,
            and draws on it as its paper. */}
        <div data-preview="" data-ink-scope="" {...slipProps(`preview-${seed ?? "example"}`, { allow: ["plain", "stained", "folded", "taped"] })} className="slip flex min-h-72 items-center justify-center px-6 py-12 text-foreground sm:px-10">
          <InkProvider key={salt} salt={salt === 0 ? undefined : salt}>
            {children}
          </InkProvider>
        </div>
      </TabsContent>
      <TabsContent value="code" keepMounted>
        {code}
      </TabsContent>
    </Tabs>
  );
}
