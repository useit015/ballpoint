"use client";

import { useEffect, useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { Progress, ProgressLabel, ProgressValue } from "@/registry/ballpoint/ui/progress";

export default function ProgressUpload() {
  const [value, setValue] = useState<number | null>(null);
  const [run, setRun] = useState(0);
  useEffect(() => {
    if (!run) return;
    // Waits (indeterminate), then fills in uneven bursts, the way a real upload does.
    let v = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const step = () => {
      v = Math.min(100, v + 6 + Math.random() * 16);
      setValue(v);
      if (v < 100) timers.push(setTimeout(step, 180 + Math.random() * 260));
    };
    timers.push(setTimeout(step, 900));
    return () => timers.forEach(clearTimeout);
  }, [run]);
  const done = value === 100;
  return (
    <div className="flex w-full max-w-md flex-col gap-5">
      <Progress value={run ? value : 0} size="lg" seed="pu-bar">
        <ProgressLabel>{!run ? "notebook.pdf" : value === null ? "Waiting for the server…" : done ? "Uploaded" : "Uploading notebook.pdf"}</ProgressLabel>
        {run > 0 && value !== null && <ProgressValue>{(formatted) => `${formatted ?? 0}%`}</ProgressValue>}
      </Progress>
      <Button variant={done ? "outline" : "default"} className="w-fit" seed="pu-go" onClick={() => {
          setValue(null);
          setRun((n) => n + 1);
        }} disabled={run > 0 && !done}>
        {done ? "Upload again" : "Upload"}
      </Button>
    </div>
  );
}
