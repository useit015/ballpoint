"use client";

import { useState } from "react";
import { Badge } from "@/registry/ballpoint/ui/badge";

const topics = ["Letters", "Sketches", "Lists", "Recipes", "Margins"];

export default function BadgeFilters() {
  const [on, setOn] = useState<string[]>(["Letters", "Lists"]);
  const toggle = (topic: string) => setOn((list) => (list.includes(topic) ? list.filter((t) => t !== topic) : [...list, topic]));
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div role="group" aria-label="Topics" className="flex flex-wrap gap-2">
        {topics.map((topic) => (
          <Badge
            key={topic}
            size="lg"
            variant={on.includes(topic) ? "default" : "outline"}
            seed={`bf-${topic}`}
            render={<button type="button" aria-pressed={on.includes(topic)} onClick={() => toggle(topic)} className="cursor-pointer" />}
          >
            {topic}
          </Badge>
        ))}
      </div>
      <p className="text-ink-2">{on.length ? `Showing ${on.join(", ").toLowerCase()}.` : "Showing everything."}</p>
    </div>
  );
}
