import { Field, FieldDescription, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";

export default function InputTypes() {
  return (
    <div className="grid w-full max-w-md gap-6">
      <Field>
        <FieldLabel htmlFor="it-password">Password</FieldLabel>
        <Input id="it-password" type="password" placeholder="At least eight characters" autoComplete="new-password" seed="it-password" />
        <FieldDescription>Use a phrase you could write from memory.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel htmlFor="it-number">Copies</FieldLabel>
        <Input id="it-number" type="number" min={1} max={20} defaultValue={3} seed="it-number" />
      </Field>
      <Field>
        <FieldLabel htmlFor="it-search">Search</FieldLabel>
        <Input id="it-search" type="search" placeholder="Find a page" seed="it-search" />
      </Field>
      <Field>
        <FieldLabel htmlFor="it-file">Photo</FieldLabel>
        <Input id="it-file" type="file" seed="it-file" />
      </Field>
    </div>
  );
}
