import { Field, FieldDescription, FieldError, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Textarea } from "@/registry/ballpoint/ui/textarea";

export default function TextareaStates() {
  return (
    <div className="grid w-full max-w-lg gap-6">
      <Field data-invalid>
        <FieldLabel htmlFor="ts-invalid">Message</FieldLabel>
        <Textarea id="ts-invalid" aria-invalid placeholder="Say something." seed="ts-invalid" />
        <FieldError>A message can&apos;t be empty.</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="ts-readonly">Read-only</FieldLabel>
        <Textarea id="ts-readonly" readOnly defaultValue="This note is locked in the archive." seed="ts-readonly" />
        <FieldDescription>Select and copy it, but it won&apos;t change.</FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel htmlFor="ts-disabled">Disabled</FieldLabel>
        <Textarea id="ts-disabled" disabled placeholder="Waiting for the pen." seed="ts-disabled" />
      </Field>
    </div>
  );
}
