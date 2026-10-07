"use client";

import { useState } from "react";
import { Label } from "@/registry/ballpoint/ui/label";
import { Slider } from "@/registry/ballpoint/ui/slider";

const money = (n: number) => `$${n}`;

export default function SliderControlled() {
  const [volume, setVolume] = useState(35);
  const [price, setPrice] = useState([20, 80]);
  return (
    <div className="flex w-full max-w-md flex-col gap-9">
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <Label id="sc-volume">Pen pressure</Label>
          <output className="text-ink-2 tabular-nums" htmlFor="sc-volume">
            {volume}%
          </output>
        </div>
        <Slider value={volume} onValueChange={(v) => setVolume(v as number)} aria-labelledby="sc-volume" seed="sc-volume" />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <Label id="sc-price">Price</Label>
          <output className="text-ink-2 tabular-nums" htmlFor="sc-price">
            {money(price[0])} – {money(price[1])}
          </output>
        </div>
        <Slider value={price} onValueChange={(v) => setPrice(v as number[])} min={0} max={100} step={5} aria-labelledby="sc-price" seed="sc-price" />
      </div>
    </div>
  );
}
