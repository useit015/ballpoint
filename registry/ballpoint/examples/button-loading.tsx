"use client";

import { useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

export default function ButtonLoading() {
  const [pending, setPending] = useState(false);
  const save = () => {
    setPending(true);
    setTimeout(() => setPending(false), 1800);
  };
  return (
    <div className="flex flex-wrap items-center gap-5">
      <Button onClick={save} disabled={pending} seed="bl-save">
        {pending && <InkGlyph name="loading" className="motion-safe:animate-spin" />}
        {pending ? "Saving…" : "Save changes"}
      </Button>
      <Button variant="outline" disabled seed="bl-disabled">
        <InkGlyph name="loading" className="motion-safe:animate-spin" /> Please wait
      </Button>
    </div>
  );
}
