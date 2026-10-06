import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/registry/ballpoint/ui/field";
import { Label } from "@/registry/ballpoint/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/ballpoint/ui/radio-group";

export default function RadioGroupDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-10">
      <RadioGroup defaultValue="blue" aria-label="Ink">
        {[
          ["blue", "Blue ballpoint"],
          ["black", "Black fineliner"],
          ["pencil", "Pencil"],
        ].map(([value, label]) => (
          <Label key={value}>
            <RadioGroupItem value={value} seed={`radio-${value}`} />
            {label}
          </Label>
        ))}
      </RadioGroup>
      <RadioGroup defaultValue="cream" aria-label="Paper" className="grid-cols-1 gap-5 sm:grid-cols-2">
        {[
          ["cream", "Cream", "Warm, like a notebook."],
          ["night", "Night", "Navy, for the lamp."],
        ].map(([value, title, description]) => (
          <FieldLabel key={value}>
            <Field orientation="horizontal">
              <RadioGroupItem value={value} seed={`paper-${value}`} />
              <FieldContent>
                <FieldTitle>{title}</FieldTitle>
                <FieldDescription>{description}</FieldDescription>
              </FieldContent>
            </Field>
          </FieldLabel>
        ))}
      </RadioGroup>
    </div>
  );
}
