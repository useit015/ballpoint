"use client";

import { useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { Checklist, ChecklistItem } from "@/registry/ballpoint/ui/checklist";
import { Progress, ProgressLabel, ProgressValue } from "@/registry/ballpoint/ui/progress";

const tasks = [
  ["pens", "Buy more blue pens"],
  ["docs", "Write the docs"],
  ["tests", "Run the test suite"],
  ["ship", "Ship it"],
] as const;

export default function ChecklistProgress() {
  const [done, setDone] = useState<string[]>(["pens", "docs"]);
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <Progress value={(done.length / tasks.length) * 100} seed="cp-progress">
        <ProgressLabel>Launch checklist</ProgressLabel>
        <ProgressValue>{() => `${done.length} of ${tasks.length}`}</ProgressValue>
      </Progress>
      <Checklist value={done} onValueChange={setDone} aria-label="Launch checklist">
        {tasks.map(([value, label]) => (
          <ChecklistItem key={value} value={value} seed={`cp-${value}`}>
            {label}
          </ChecklistItem>
        ))}
      </Checklist>
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={() => setDone(tasks.map(([v]) => v))} seed="cp-all">
          Check all
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setDone([])} seed="cp-none">
          Clear
        </Button>
      </div>
    </div>
  );
}
