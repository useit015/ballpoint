"use client";

import { useState } from "react";
import { Badge } from "@/registry/ballpoint/ui/badge";
import { Button } from "@/registry/ballpoint/ui/button";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

const start = ["ink", "paper", "margins", "coffee"];

export default function BadgeRemovable() {
  const [tags, setTags] = useState(start);
  return (
    <div className="flex w-full max-w-md flex-col items-start gap-4">
      <ul aria-label="Tags" className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <li key={tag}>
            <Badge variant="secondary" size="lg" seed={`br-${tag}`} className="gap-1.5 pr-1.5">
              {tag}
              <button type="button" aria-label={`Remove ${tag}`} onClick={() => setTags((t) => t.filter((x) => x !== tag))} className="grid size-5 cursor-pointer place-items-center rounded-full text-ink-2 hover:text-ink">
                <InkGlyph name="close" className="size-3" />
              </button>
            </Badge>
          </li>
        ))}
        {tags.length === 0 && <li className="text-ink-3">No tags left.</li>}
      </ul>
      {tags.length < start.length && (
        <Button variant="ghost" size="sm" seed="br-reset" onClick={() => setTags(start)}>
          Put them back
        </Button>
      )}
    </div>
  );
}
