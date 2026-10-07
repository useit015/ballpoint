"use client";

import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/ballpoint/ui/select";

const inks = [
  { label: "Blue", value: "blue" },
  { label: "Black", value: "black" },
  { label: "Green", value: "green" },
];

export default function SelectControlled() {
  const [ink, setInk] = useState<string | null>("blue");
  return (
    <div className="flex flex-col items-start gap-4">
      <Select items={inks} value={ink} onValueChange={setInk}>
        <SelectTrigger aria-label="Ink" className="w-48" seed="scn">
          <SelectValue placeholder="Pick an ink" />
        </SelectTrigger>
        <SelectContent seed="scn-list">
          {inks.map((i) => (
            <SelectItem key={i.value} value={i.value}>
              {i.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-ink-2">{ink ? `Writing in ${ink}.` : "No ink chosen."}</p>
    </div>
  );
}
