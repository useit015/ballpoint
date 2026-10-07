"use client";

import { Button } from "@/registry/ballpoint/ui/button";
import { Field, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Textarea } from "@/registry/ballpoint/ui/textarea";

export default function TextareaWithButton() {
  return (
    <form onSubmit={(event) => event.preventDefault()} className="flex w-full max-w-lg flex-col gap-4">
      <Field>
        <FieldLabel htmlFor="twb-message">Your message</FieldLabel>
        <Textarea id="twb-message" placeholder="Type your message here." seed="twb-message" />
      </Field>
      <Button type="submit" className="self-end" seed="twb-send">
        Send message
      </Button>
    </form>
  );
}
