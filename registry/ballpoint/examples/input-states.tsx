import { Field, FieldDescription, FieldError, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";

export default function InputStates() {
  return (
    <div className="grid w-full max-w-md gap-6">
      <Field>
        <FieldLabel htmlFor="is-readonly">Read-only</FieldLabel>
        <Input id="is-readonly" readOnly defaultValue="ballpoint.st9wd.com" seed="is-readonly" />
        <FieldDescription>You can select it and copy it, but not change it.</FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel htmlFor="is-disabled">Disabled</FieldLabel>
        <Input id="is-disabled" disabled defaultValue="Locked while it saves" seed="is-disabled" />
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="is-invalid">Handle</FieldLabel>
        <Input id="is-invalid" aria-invalid defaultValue="ada lovelace" seed="is-invalid" />
        <FieldError>Handles can&apos;t have spaces.</FieldError>
      </Field>
      <Field>
        <FieldLabel htmlFor="is-line">On the line</FieldLabel>
        <Input id="is-line" variant="line" aria-invalid defaultValue="Wrong, in red pen" seed="is-line" />
      </Field>
    </div>
  );
}
