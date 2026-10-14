import { Field, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/registry/ballpoint/ui/select";

const items = [
  { label: "A5", value: "a5" },
  { label: "A4", value: "a4" },
  { label: "Letter", value: "letter" },
];

export default function SelectSizes() {
  return (
    <div className="flex flex-wrap items-end gap-8">
      {(["sm", "default"] as const).map((size) => (
        <Field key={size} className="w-40">
          <FieldLabel htmlFor={`sz-${size}`}>{size}</FieldLabel>
          <Select items={items} defaultValue="a5">
            <SelectTrigger id={`sz-${size}`} size={size} seed={`sz-${size}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent seed={`sz-list-${size}`}>
              {items.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      ))}
    </div>
  );
}
