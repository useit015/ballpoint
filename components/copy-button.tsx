"use client";

import { useEffect, useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { cn } from "@/lib/utils";

// Two sheets, one over the other; and a tick for "copied". Drawn once, by hand.
const sheets = ["M5.5 5.6C5.4 4.3 5.6 3 5.8 1.8c2.8-.2 5.6-.1 8.4.1.2 3 .1 5.8-.1 8.6-1.2.2-2.5.2-3.8.1", "M1.9 6c2.8-.3 5.7-.3 8.5 0 .2 2.9.2 5.7 0 8.4-2.8.3-5.7.3-8.5 0-.3-2.7-.3-5.6 0-8.4Z"];
const tick = "M2.4 8.6c1.3 1.1 2.5 2.4 3.6 3.8 2.3-3.5 4.9-6.6 8-9.4";

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <>
      <Button
        variant="ghost"
        size="icon-sm"
        className={cn("text-ink-3 hover:text-ink", className)}
        aria-label={copied ? "Copied" : "Copy to clipboard"}
        draw="none"
        onClick={async () => {
          await navigator.clipboard.writeText(text);
          setCopied(true);
        }}
      >
        <svg viewBox="0 0 16 16" aria-hidden="true" className="size-4 overflow-visible" fill="none" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" strokeLinejoin="round">
          {copied ? <path d={tick} strokeWidth={1.8} /> : sheets.map((d) => <path key={d} d={d} />)}
        </svg>
      </Button>
      <span role="status" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </>
  );
}
