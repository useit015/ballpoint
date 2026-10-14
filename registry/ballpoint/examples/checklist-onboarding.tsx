"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/ballpoint/ui/card";
import { Checklist, ChecklistItem } from "@/registry/ballpoint/ui/checklist";
import { Progress, ProgressLabel, ProgressValue } from "@/registry/ballpoint/ui/progress";

const tasks = [
  ["account", "Make an account"],
  ["pen", "Pick a pen"],
  ["paper", "Pick a paper"],
  ["write", "Write your first line"],
  ["share", "Show someone"],
] as const;

export default function ChecklistOnboarding() {
  const [done, setDone] = useState<string[]>(["account", "pen"]);
  const finished = done.length === tasks.length;
  return (
    <Card className="w-full max-w-sm" variant={finished ? "wash" : "outline"} seed="co-card">
      <CardHeader>
        <CardTitle>{finished ? "All set." : "Getting started"}</CardTitle>
        <CardDescription>{finished ? "That is everything. Now go and write." : `${tasks.length - done.length} to go.`}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <Progress value={(done.length / tasks.length) * 100} size="sm" seed="co-progress">
          <ProgressLabel>Done so far</ProgressLabel>
          <ProgressValue>{() => `${done.length} / ${tasks.length}`}</ProgressValue>
        </Progress>
        <Checklist value={done} onValueChange={setDone} aria-label="Getting started">
          {tasks.map(([value, label]) => (
            <ChecklistItem key={value} value={value} seed={`co-${value}`}>
              {label}
            </ChecklistItem>
          ))}
        </Checklist>
      </CardContent>
    </Card>
  );
}
