"use client";

import { useState } from "react";
import { Badge } from "@/registry/ballpoint/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ballpoint/ui/tabs";

const boxes = {
  inbox: { label: "Inbox", count: 3, letters: ["Dear Ada, the ink arrived.", "A postcard from the lake.", "Your notebook has shipped."] },
  sent: { label: "Sent", count: 12, letters: ["To Grace: more soon.", "To Katherine: yes, Tuesday."] },
  drafts: { label: "Drafts", count: 1, letters: ["Dear diary…"] },
} as const;

export default function TabsCounts() {
  const [box, setBox] = useState<keyof typeof boxes>("inbox");
  return (
    <Tabs value={box} onValueChange={(v) => setBox(v as keyof typeof boxes)} className="w-full max-w-md">
      <TabsList variant="line" seed="tc-list">
        {Object.entries(boxes).map(([key, { label, count }]) => (
          <TabsTrigger key={key} value={key} className="gap-2">
            {label}
            <Badge variant={key === box ? "default" : "outline"} size="sm" seed={`tc-${key}`}>
              {count}
            </Badge>
          </TabsTrigger>
        ))}
      </TabsList>
      {Object.entries(boxes).map(([key, { letters }]) => (
        <TabsContent key={key} value={key}>
          <ul className="flex flex-col gap-2 pt-2 text-ink-2">
            {letters.map((letter) => (
              <li key={letter}>{letter}</li>
            ))}
          </ul>
        </TabsContent>
      ))}
    </Tabs>
  );
}
