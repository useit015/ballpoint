"use client";

import { useState, type PointerEvent, type ReactNode } from "react";
import { TornSheet } from "@/components/torn-sheet";
import { CodeFrame } from "@/components/code-frame";
import { CopyButton } from "@/components/copy-button";
import { SubscribeDemo, type Part } from "@/components/home/subscribe-demo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ballpoint/ui/tabs";

export type ApiPanel = { value: string; label: string; code: string; html: string };

/**
 * The code on the left, what it draws on the right, and the two linked:
 * point at a line of the code and the part of the form it makes is marked in
 * red pen; touch the form (or tab to it) and its line is marked in the code.
 * The inked HTML of the code comes from the server.
 */
export function ApiPlayground({ panels, children }: { panels: ApiPanel[]; children?: ReactNode }) {
  const [value, setValue] = useState(panels[0].value);
  const [part, setPart] = useState<Part | null>(null);
  const active = panels.find((p) => p.value === value) ?? panels[0];
  const over = (e: PointerEvent<HTMLElement>) => {
    const line = (e.target as Element).closest<HTMLElement>("[data-for]");
    setPart((line?.dataset.for as Part | undefined) ?? null);
  };
  return (
    <div className="api-grid" data-part={part ?? undefined}>
      <div id="api-code" onPointerOver={over} onPointerLeave={() => setPart(null)}>
        <Tabs value={value} onValueChange={(v) => setValue(String(v))} className="gap-0">
          <CodeFrame
            className="api-code"
            header={
              <>
                <TabsList variant="line" aria-label="Code" className="-ml-1 gap-1 text-sm">
                  {panels.map((p) => (
                    <TabsTrigger key={p.value} value={p.value} className="h-8 text-sm">
                      {p.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
                <CopyButton text={active.code} />
              </>
            }
          >
            {panels.map((p) => (
              <TabsContent key={p.value} value={p.value}>
                <div dangerouslySetInnerHTML={{ __html: p.html }} />
              </TabsContent>
            ))}
          </CodeFrame>
        </Tabs>
      </div>
      <div className="api-side">
        <TornSheet as="div" slip flush edge="b" tilt="0.3deg">
          <div className="api-out">
            <h3 className="api-out-title">Rendered output</h3>
            <p className="api-hint">Point at a line of code, or at the form.</p>
            <SubscribeDemo part={part} onPart={setPart} />
          </div>
        </TornSheet>
        {children}
      </div>
    </div>
  );
}
