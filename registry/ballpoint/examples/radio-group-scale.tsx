"use client";

import { useState } from "react";
import { Label } from "@/registry/ballpoint/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/ballpoint/ui/radio-group";

export default function RadioGroupScale() {
  const [score, setScore] = useState("");
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <span id="rsc-q" className="font-bold">
        How did the pen feel?
      </span>
      <RadioGroup orientation="horizontal" value={score} onValueChange={(v) => setScore(v as string)} aria-labelledby="rsc-q" className="justify-between gap-0">
        {[1, 2, 3, 4, 5].map((n) => (
          <Label key={n} className="flex-col gap-2">
            <RadioGroupItem value={String(n)} seed={`rsc-${n}`} />
            {n}
          </Label>
        ))}
      </RadioGroup>
      <div className="flex justify-between text-sm text-ink-3">
        <span>Scratchy</span>
        <span>Smooth</span>
      </div>
      <p className="text-ink-2">{score ? `You gave it a ${score}.` : "Pick one."}</p>
    </div>
  );
}
