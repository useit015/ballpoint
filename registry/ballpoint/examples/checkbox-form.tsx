"use client";

import { useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/registry/ballpoint/ui/field";

export default function CheckboxForm() {
  const [agreed, setAgreed] = useState(false);
  const [tried, setTried] = useState(false);
  const [done, setDone] = useState(false);
  const invalid = tried && !agreed;
  return (
    <form
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        setTried(true);
        setDone(agreed);
      }}
    >
      <FieldGroup>
        <Field orientation="horizontal" data-invalid={invalid || undefined}>
          <Checkbox id="cf-agree" checked={agreed} onCheckedChange={(on) => setAgreed(on)} aria-invalid={invalid} seed="cf-agree" />
          <div className="grid gap-1">
            <FieldLabel htmlFor="cf-agree">I have read the terms</FieldLabel>
            <FieldDescription>Nothing in them is surprising. We checked.</FieldDescription>
            {invalid && <FieldError>Tick the box to go on.</FieldError>}
          </div>
        </Field>
        <div className="flex items-center gap-4">
          <Button type="submit" seed="cf-submit">
            Sign up
          </Button>
          {done && <span className="text-ink-2">Welcome aboard.</span>}
        </div>
      </FieldGroup>
    </form>
  );
}
