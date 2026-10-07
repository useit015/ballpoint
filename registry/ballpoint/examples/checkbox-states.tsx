import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Label } from "@/registry/ballpoint/ui/label";

export default function CheckboxStates() {
  return (
    <div className="grid w-full max-w-md gap-5">
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <Label>
          <Checkbox seed="cs-off" />
          Unchecked
        </Label>
        <Label>
          <Checkbox defaultChecked seed="cs-on" />
          Checked
        </Label>
        <Label>
          <Checkbox indeterminate seed="cs-mixed" />
          Mixed
        </Label>
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <Label>
          <Checkbox disabled seed="cs-disabled" />
          Disabled
        </Label>
        <Label>
          <Checkbox disabled defaultChecked seed="cs-disabled-on" />
          Disabled, checked
        </Label>
      </div>
      <Field orientation="horizontal" data-invalid>
        <Checkbox id="cs-terms" aria-invalid seed="cs-terms" />
        <FieldContent>
          <FieldLabel htmlFor="cs-terms">Accept the terms</FieldLabel>
          <FieldDescription>You need to agree to continue.</FieldDescription>
          <FieldError>Please tick the box.</FieldError>
        </FieldContent>
      </Field>
    </div>
  );
}
