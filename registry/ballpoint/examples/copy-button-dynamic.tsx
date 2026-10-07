"use client";

import { useState } from "react";
import { CopyButton } from "@/registry/ballpoint/ui/copy-button";
import { Input } from "@/registry/ballpoint/ui/input";

// Pass a function and the value is read at the moment of the click.
export default function CopyButtonDynamic() {
  const [text, setText] = useState("Dear Ada,");
  const [copied, setCopied] = useState<string>();
  return (
    <div className="flex w-full max-w-md flex-col gap-4">
      <div className="flex items-center gap-3">
        <Input aria-label="Text to copy" value={text} onChange={(e) => setText(e.target.value)} className="flex-1" seed="cbd-input" />
        <CopyButton value={() => text} onCopy={setCopied} seed="cbd-copy">
          Copy
        </CopyButton>
      </div>
      {copied && <p className="text-sm text-ink-3">Last copied: “{copied}”</p>}
    </div>
  );
}
