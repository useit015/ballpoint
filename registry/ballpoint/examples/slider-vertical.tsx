"use client";

import { useState } from "react";
import { Slider } from "@/registry/ballpoint/ui/slider";

const channels = ["Ink", "Paper", "Lamp"];

export default function SliderVertical() {
  const [levels, setLevels] = useState([70, 40, 85]);
  return (
    <div className="flex h-56 items-stretch gap-12">
      {channels.map((name, i) => (
        <div key={name} className="flex flex-col items-center gap-4">
          <Slider
            orientation="vertical"
            value={levels[i]}
            onValueChange={(v) => setLevels((all) => all.map((x, j) => (j === i ? (v as number) : x)))}
            aria-label={name}
            seed={`sv-${name}`}
          />
          <span className="text-sm text-ink-2">{name}</span>
          <output className="-mt-3 text-sm text-ink-3 tabular-nums">{levels[i]}</output>
        </div>
      ))}
    </div>
  );
}
