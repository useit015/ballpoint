"use client";

import { useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { Redact } from "@/registry/ballpoint/ui/redact";

const lines = [
  ["Codename", "Blue Biro"],
  ["Launch", "October 14th"],
  ["Budget", "$1,200"],
] as const;

export default function RedactControlled() {
  const [revealed, setRevealed] = useState(false);
  return (
    <div className="flex w-full max-w-sm flex-col gap-5">
      <dl className="flex flex-col gap-2 text-lg text-ink-2">
        {lines.map(([term, value]) => (
          <div key={term} className="flex gap-3">
            <dt className="w-24 text-ink-3">{term}</dt>
            <dd>
              <Redact revealed={revealed} onRevealedChange={setRevealed} label={`${term}, hidden`} seed={`rc-${term}`}>
                {value}
              </Redact>
            </dd>
          </div>
        ))}
      </dl>
      <Button variant="outline" size="sm" className="w-fit" onClick={() => setRevealed((r) => !r)} seed="rc-toggle">
        {revealed ? "Cover them up" : "Show everything"}
      </Button>
    </div>
  );
}
