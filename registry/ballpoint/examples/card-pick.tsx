"use client";

import { useState } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/registry/ballpoint/ui/card";
import { InkIcon, type IconName } from "@/registry/ballpoint/ui/ink-icons";

const options: { value: string; title: string; note: string; icon: IconName }[] = [
  { value: "note", title: "A note", note: "A line or two, in the margin.", icon: "edit" },
  { value: "letter", title: "A letter", note: "Ruled paper, a margin, a signature.", icon: "mail" },
  { value: "sketch", title: "A sketch", note: "Squared paper, for plans.", icon: "ruler" },
];

export default function CardPick() {
  const [picked, setPicked] = useState("letter");
  return (
    <div role="radiogroup" aria-label="What to write" className="grid w-full gap-8 sm:grid-cols-3">
      {options.map((option) => (
        <Card
          key={option.value}
          interactive
          selected={picked === option.value}
          variant={picked === option.value ? "wash" : "outline"}
          size="sm"
          seed={`pick-${option.value}`}
          render={<button type="button" role="radio" aria-checked={picked === option.value} onClick={() => setPicked(option.value)} />}
          className="text-left"
        >
          <CardHeader>
            <InkIcon name={option.icon} className="mb-2 size-6" />
            <CardTitle>{option.title}</CardTitle>
            <CardDescription>{option.note}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}
