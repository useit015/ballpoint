import { Field, FieldDescription, FieldError, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/ballpoint/ui/select";

const sizes = [
  { label: "A5", value: "a5" },
  { label: "A4", value: "a4" },
  { label: "Letter", value: "letter" },
];

export default function SelectForm() {
  return (
    <div className="grid w-full max-w-sm gap-6">
      <Field>
        <FieldLabel htmlFor="sf-size">Paper size</FieldLabel>
        <Select items={sizes} defaultValue="a5">
          <SelectTrigger id="sf-size" className="w-full" seed="sf-size">
            <SelectValue />
          </SelectTrigger>
          <SelectContent seed="sf-size-list">
            {sizes.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldDescription>Used for printing and export.</FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel htmlFor="sf-ruling">Ruling</FieldLabel>
        <Select items={sizes}>
          <SelectTrigger id="sf-ruling" aria-invalid className="w-full" seed="sf-ruling">
            <SelectValue placeholder="Choose one" />
          </SelectTrigger>
          <SelectContent seed="sf-ruling-list">
            {sizes.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FieldError>Please choose a ruling.</FieldError>
      </Field>
    </div>
  );
}
