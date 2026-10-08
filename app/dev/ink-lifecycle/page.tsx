"use client";

import { useState } from "react";
import { InkProvider } from "@/registry/ballpoint/hooks/use-ink-box";
import { Button } from "@/registry/ballpoint/ui/button";
import { HatchGrid } from "@/registry/ballpoint/ui/hatch-grid";
import { SectionHeading } from "@/registry/ballpoint/ui/section-heading";

export default function InkLifecycle() {
  const [specks, setSpecks] = useState(false);
  const [draw, setDraw] = useState<"none" | "mount" | "auto">("none");
  const [variant, setVariant] = useState<"ghost" | "default">("ghost");
  const days = [{ date: "2026-01-01", count: 2 }];
  return (
    <main id="main" className="mx-auto flex max-w-lg flex-col gap-8 p-8">
      <button onClick={() => setSpecks((value) => !value)}>Toggle specks</button>
      <SectionHeading specks={specks}>Conditional drawing</SectionHeading>
      <button onClick={() => setDraw("auto")}>Set auto</button>
      <button onClick={() => setDraw("mount")}>Set mount</button>
      <button onClick={() => setVariant((value) => value === "ghost" ? "default" : "ghost")}>Toggle variant</button>
      <Button draw={draw} variant={variant} data-testid="dynamic-button">Dynamic drawing</Button>
      <HatchGrid draw="none" data={days} summary="Direct opt-out" />
      <InkProvider draw="none"><HatchGrid data={days} summary="Provider opt-out" /></InkProvider>
    </main>
  );
}
