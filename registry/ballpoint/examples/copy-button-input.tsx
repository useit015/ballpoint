import { CopyButton } from "@/registry/ballpoint/ui/copy-button";
import { Field, FieldDescription, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";

export default function CopyButtonInput() {
  return (
    <Field className="w-full max-w-sm">
      <FieldLabel htmlFor="cbi-link">Invite link</FieldLabel>
      <div className="flex items-center gap-2">
        <Input id="cbi-link" readOnly defaultValue="https://example.com/join/4fK9q" seed="cbi-link" className="min-w-0 flex-1" />
        <CopyButton value="https://example.com/join/4fK9q" copiedLabel="Copied" seed="cbi-copy">
          Copy
        </CopyButton>
      </div>
      <FieldDescription>Anyone with it can join. It stops working in a week.</FieldDescription>
    </Field>
  );
}
