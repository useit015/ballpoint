"use client";

import { useState } from "react";
import { Field, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Textarea } from "@/registry/ballpoint/ui/textarea";

const LIMIT = 120;

export default function TextareaCounter() {
  const [text, setText] = useState("Dear Ada, the ink arrived.");
  const over = text.length > LIMIT;
  return (
    <Field className="w-full max-w-lg" data-invalid={over || undefined}>
      <FieldLabel htmlFor="tc-note">Postcard</FieldLabel>
      <Textarea id="tc-note" value={text} onChange={(e) => setText(e.target.value)} aria-invalid={over} aria-describedby="tc-count" seed="tc-note" />
      <p id="tc-count" className={over ? "text-sm text-destructive" : "text-sm text-ink-3"}>
        {text.length} / {LIMIT}
        {over && " – too long for a postcard"}
      </p>
    </Field>
  );
}
