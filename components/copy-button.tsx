"use client";

import { useEffect, useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";

export function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <Button
      variant="ghost"
      size="xs"
      className={className}
      aria-label={copied ? "Copied" : "Copy code"}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
      }}
    >
      <span aria-hidden="true">{copied ? "Copied" : "Copy"}</span>
    </Button>
  );
}
