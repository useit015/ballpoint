"use client";

import { useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";
import { SignaturePad } from "@/registry/ballpoint/ui/signature-pad";

export default function SignaturePadForm() {
  const [result, setResult] = useState<{ name: string; signature: string } | null>(null);
  return (
    <form
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        setResult({ name: String(data.get("name")), signature: String(data.get("signature")) });
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="spf-name">Full name</FieldLabel>
          <Input id="spf-name" name="name" required defaultValue="Grace Hopper" seed="spf-name" />
        </Field>
        <SignaturePad name="signature" required label="Sign to agree" placeholder="Sign here" seed="spf-pad" />
        <Field orientation="horizontal">
          <Checkbox id="spf-copy" name="copy" defaultChecked seed="spf-copy" />
          <FieldLabel htmlFor="spf-copy">Send me a copy</FieldLabel>
        </Field>
        <div className="flex min-h-12 items-center gap-4">
          <Button type="submit" seed="spf-submit">
            Agree and sign
          </Button>
          {result && (
            <span className="flex items-center gap-3 text-ink-2">
              Signed by {result.name}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={result.signature} alt="Signature" className="h-10 w-auto" />
            </span>
          )}
        </div>
      </FieldGroup>
    </form>
  );
}
