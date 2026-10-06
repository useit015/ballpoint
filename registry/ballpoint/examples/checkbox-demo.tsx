"use client";

import { useState } from "react";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Label } from "@/registry/ballpoint/ui/label";

const items = ["Paper", "Ink", "A steady hand"];

export default function CheckboxDemo() {
  const [picked, setPicked] = useState(["Paper"]);
  const all = picked.length === items.length;
  return (
    <FieldGroup className="max-w-md">
      <Field orientation="horizontal">
        <Checkbox id="cb-terms" defaultChecked seed="cb-terms" />
        <FieldContent>
          <FieldLabel htmlFor="cb-terms">Send me the newsletter</FieldLabel>
          <FieldDescription>Once a month, written by hand. Well, typed.</FieldDescription>
        </FieldContent>
      </Field>
      <div className="flex flex-col gap-3">
        <Label>
          <Checkbox
            seed="cb-all"
            checked={all}
            indeterminate={picked.length > 0 && !all}
            onCheckedChange={(checked) => setPicked(checked ? items : [])}
          />
          Everything you need
        </Label>
        {items.map((item) => (
          <Label key={item} className="pl-7">
            <Checkbox
              seed={`cb-${item}`}
              checked={picked.includes(item)}
              onCheckedChange={(checked) => setPicked((p) => (checked ? [...p, item] : p.filter((x) => x !== item)))}
            />
            {item}
          </Label>
        ))}
      </div>
      <Label>
        <Checkbox disabled seed="cb-disabled" />
        Disabled
      </Label>
    </FieldGroup>
  );
}
