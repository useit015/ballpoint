"use client";

import { useState } from "react";
import { flushSync } from "react-dom";
import { Button } from "@/registry/ballpoint/ui/button";
import type { InkDraw } from "@/registry/ballpoint/hooks/use-ink-box";

const variants = ["default", "outline", "secondary", "destructive"] as const;

/**
 * Mounts N buttons in one synchronous commit, including the re-render each
 * one does after measuring itself, and reports how long that took.
 * Budget: 200 in under 50ms.
 */
export function Bench() {
  const [count, setCount] = useState(0);
  const [result, setResult] = useState<string>("");
  // ?draw=none|mount|auto, to compare what drawing modes cost.
  const [draw] = useState<InkDraw | undefined>(() =>
    typeof location === "undefined" ? undefined : ((new URLSearchParams(location.search).get("draw") as InkDraw | null) ?? undefined),
  );

  function run(n: number) {
    flushSync(() => setCount(0));
    const t0 = performance.now();
    flushSync(() => setCount(n));
    const commit = performance.now() - t0;
    // Recorded straight away: rAF doesn't run in a hidden tab.
    document.documentElement.dataset.bench = JSON.stringify({ n, commit });
    setResult(`${n} buttons: commit ${commit.toFixed(1)}ms`);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-4">
        <Button onClick={() => run(200)} seed="bench-run">
          Mount 200
        </Button>
        <Button variant="outline" onClick={() => run(0)} seed="bench-clear">
          Clear
        </Button>
      </div>
      <output data-testid="bench-result">{result}</output>
      <div className="flex flex-wrap gap-4">
        {Array.from({ length: count }, (_, i) => (
          <Button key={i} variant={variants[i % variants.length]} seed={i} draw={draw}>
            Button {i}
          </Button>
        ))}
      </div>
    </div>
  );
}
