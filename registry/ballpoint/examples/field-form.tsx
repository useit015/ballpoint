"use client";

import { useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";
import { RadioGroup, RadioGroupItem } from "@/registry/ballpoint/ui/radio-group";
import { Textarea } from "@/registry/ballpoint/ui/textarea";

export default function FieldForm() {
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({});
  const [sent, setSent] = useState(false);
  return (
    <form
      noValidate
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const next: typeof errors = {};
        if (!String(data.get("name")).trim()) next.name = "Tell us what to call you.";
        if (!/^\S+@\S+\.\S+$/.test(String(data.get("email")))) next.email = "That doesn't look like an email.";
        setErrors(next);
        setSent(Object.keys(next).length === 0);
      }}
    >
      <FieldSet>
        <FieldLegend>Book a lesson</FieldLegend>
        <FieldDescription>Left-handed or right-handed, we have pens for both.</FieldDescription>
        <FieldGroup>
          <Field data-invalid={errors.name ? true : undefined}>
            <FieldLabel htmlFor="ff-name">Name</FieldLabel>
            <Input id="ff-name" name="name" aria-invalid={!!errors.name} seed="ff-name" />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </Field>
          <Field data-invalid={errors.email ? true : undefined}>
            <FieldLabel htmlFor="ff-email">Email</FieldLabel>
            <Input id="ff-email" name="email" type="email" aria-invalid={!!errors.email} seed="ff-email" />
            {errors.email && <FieldError>{errors.email}</FieldError>}
          </Field>
          <FieldSet>
            <FieldLegend variant="label">Which hand?</FieldLegend>
            <RadioGroup name="hand" defaultValue="right" orientation="horizontal" aria-label="Which hand">
              {["Right", "Left"].map((hand) => (
                <Field key={hand} orientation="horizontal">
                  <RadioGroupItem value={hand.toLowerCase()} id={`ff-${hand}`} seed={`ff-${hand}`} />
                  <FieldLabel htmlFor={`ff-${hand}`}>{hand}</FieldLabel>
                </Field>
              ))}
            </RadioGroup>
          </FieldSet>
          <Field>
            <FieldLabel htmlFor="ff-note">Anything else</FieldLabel>
            <Textarea id="ff-note" name="note" rows={3} seed="ff-note" />
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="ff-updates" name="updates" defaultChecked seed="ff-updates" />
            <FieldLabel htmlFor="ff-updates">Send me updates</FieldLabel>
          </Field>
          <div className="flex items-center gap-4">
            <Button type="submit" seed="ff-submit">
              Book it
            </Button>
            {sent && <span className="text-ink-2">Booked. See you Tuesday.</span>}
          </div>
        </FieldGroup>
      </FieldSet>
    </form>
  );
}
