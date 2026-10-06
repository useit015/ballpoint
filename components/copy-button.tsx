"use client";

import { cn } from "@/lib/utils";
import { CopyButton as InkCopyButton } from "@/registry/ballpoint/ui/copy-button";

/** The docs' copy button for code: the registry's CopyButton, as a quiet icon. */
export function CopyButton({ text, className }: { text: string; className?: string }) {
  return (
    <InkCopyButton value={text} variant="ghost" size="icon-sm" draw="none" className={cn("text-ink-3 hover:text-ink", className)}>
      Copy to clipboard
    </InkCopyButton>
  );
}
