"use client";

import { useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/ballpoint/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/registry/ballpoint/ui/radio-group";
import { Label } from "@/registry/ballpoint/ui/label";

const pens = [
  ["Blue ballpoint", "Everyday"],
  ["Black fineliner", "Drawings"],
  ["Pencil", "Drafts"],
  ["Green ink", "Corrections"],
] as const;

export default function PopoverPens() {
  const [pen, setPen] = useState<string>(pens[0][0]);
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger render={<Button variant="outline" className="w-64 justify-between" seed="pp-open" />}>{pen}</PopoverTrigger>
      <PopoverContent seed="pp" align="start" className="w-64">
        <RadioGroup
          aria-label="Pen"
          value={pen}
          onValueChange={(value) => {
            setPen(value as string);
            setOpen(false);
          }}
        >
          {pens.map(([name, use]) => (
            <Label key={name} className="justify-between">
              <span className="flex items-center gap-3">
                <RadioGroupItem value={name} seed={`pp-${name}`} />
                {name}
              </span>
              <span className="text-sm text-ink-3">{use}</span>
            </Label>
          ))}
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
}
