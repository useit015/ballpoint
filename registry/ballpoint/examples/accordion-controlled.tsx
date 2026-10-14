"use client";

import { useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/ballpoint/ui/accordion";
import { Button } from "@/registry/ballpoint/ui/button";

const steps = [
  ["Install", "Run init once, then add what you need."],
  ["Draw", "Every component draws itself in the first time it is seen."],
  ["Customize", "Pick a pen and a paper, and the whole page follows."],
];

export default function AccordionControlled() {
  const [open, setOpen] = useState<string[]>([]);
  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <div className="flex gap-3">
        <Button variant="outline" size="sm" seed="ac-all" onClick={() => setOpen(steps.map(([title]) => title))}>
          Open all
        </Button>
        <Button variant="ghost" size="sm" seed="ac-none" onClick={() => setOpen([])}>
          Close all
        </Button>
      </div>
      <Accordion multiple value={open} onValueChange={(value) => setOpen(value as string[])}>
        {steps.map(([title, body]) => (
          <AccordionItem key={title} value={title}>
            <AccordionTrigger seed={`ac-${title}`}>{title}</AccordionTrigger>
            <AccordionContent>{body}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
