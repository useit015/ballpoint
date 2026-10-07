import { Field, FieldDescription, FieldError, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";

// Hand FieldError a list (from a schema validator, say) and it shows each message once.
const errors = [{ message: "Use at least 8 characters." }, { message: "Add a number." }, { message: "Add a number." }];

export default function FieldErrors() {
  return (
    <div className="grid w-full max-w-md gap-6">
      <Field data-invalid>
        <FieldLabel htmlFor="fe-password">Password</FieldLabel>
        <Input id="fe-password" type="password" aria-invalid defaultValue="ink" seed="fe-password" />
        <FieldError errors={errors} />
      </Field>
      <Field>
        <FieldLabel htmlFor="fe-hint">Display name</FieldLabel>
        <Input id="fe-hint" placeholder="Ada" seed="fe-hint" />
        <FieldDescription>Shown beside your notes. You can change it later.</FieldDescription>
      </Field>
    </div>
  );
}
