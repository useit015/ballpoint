"use client";

import { useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { Progress, ProgressLabel, ProgressValue } from "@/registry/ballpoint/ui/progress";

export default function ProgressControlled() {
  const [value, setValue] = useState(25);
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Progress value={value} seed="pc-progress">
        <ProgressLabel>Chapter progress</ProgressLabel>
        <ProgressValue />
      </Progress>
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={() => setValue((v) => Math.max(0, v - 15))} seed="pc-less">
          Less
        </Button>
        <Button size="sm" onClick={() => setValue((v) => Math.min(100, v + 15))} seed="pc-more">
          More
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setValue(0)} seed="pc-reset">
          Reset
        </Button>
      </div>
    </div>
  );
}
