"use client";

import { useState } from "react";
import { Label } from "@/registry/ballpoint/ui/label";
import { Slider } from "@/registry/ballpoint/ui/slider";

const weights = [
  { value: 0, label: "Fine" },
  { value: 25, label: "Light" },
  { value: 50, label: "Medium" },
  { value: 75, label: "Bold" },
  { value: 100, label: "Marker" },
];

export default function SliderMarks() {
  const [weight, setWeight] = useState(50);
  return (
    <div className="flex w-full max-w-lg flex-col gap-10">
      <div className="flex flex-col gap-3">
        <Label id="sm-weight">Line weight</Label>
        <Slider value={weight} onValueChange={(v) => setWeight(v as number)} step={25} marks={weights} aria-labelledby="sm-weight" seed="sm-weight" />
      </div>
      <div className="flex flex-col gap-3">
        <Label id="sm-step">One tick for every step</Label>
        <Slider defaultValue={[2, 6]} min={0} max={10} step={1} marks aria-labelledby="sm-step" seed="sm-step" />
      </div>
    </div>
  );
}
