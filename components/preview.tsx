"use client";

import { useState, type ReactNode } from "react";
import { InkProvider } from "@/registry/ballpoint/hooks/use-ink-box";
import { Button } from "@/registry/ballpoint/ui/button";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ballpoint/ui/tabs";
import { cn } from "@/lib/utils";

/**
 * A live example and its code. "Redraw" hands the example a new salt and
 * remounts it, so every stroke is drawn in again by a slightly different
 * hand. The example sits on a slip with a faint sketchbook grid; the page's
 * main one is held down with a strip of tape.
 */
export function Preview({ children, code, className, taped = false }: { children: ReactNode; code: ReactNode; className?: string; taped?: boolean }) {
  const [tab, setTab] = useState("preview");
  const [salt, setSalt] = useState(0);
  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as string)} className={cn("doc-example gap-0", className)}>
      <div className="doc-example-bar">
        <TabsList variant="line" aria-label="Example">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        {tab === "preview" && (
          <Button variant="ghost" size="sm" seed="redraw" className="gap-1.5 text-ink-2" onClick={() => setSalt((s) => s + 1)}>
            <InkIcon name="refresh" className="size-4" />
            Redraw
          </Button>
        )}
      </div>
      <TabsContent value="preview" keepMounted className="mt-4">
        {/* Every example sits centred on the same slip, and draws on it as its paper. */}
        <div data-preview="" data-ink-scope="" data-slip={taped ? "taped" : "plain"} className="doc-stage slip relative flex min-h-72 items-center justify-center px-6 py-12 text-foreground sm:px-10">
          <InkProvider key={salt} salt={salt === 0 ? undefined : salt}>
            {children}
          </InkProvider>
        </div>
      </TabsContent>
      <TabsContent value="code" keepMounted className="mt-4">
        {code}
      </TabsContent>
    </Tabs>
  );
}
