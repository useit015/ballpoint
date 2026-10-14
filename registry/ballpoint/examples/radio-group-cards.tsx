import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/registry/ballpoint/ui/field";
import { RadioGroup, RadioGroupItem } from "@/registry/ballpoint/ui/radio-group";

const papers = [
  ["cream", "Cream", "Warm, like old letters."],
  ["white", "White", "Crisp, for drawings."],
  ["legal", "Legal pad", "Yellow, for lists and plans."],
] as const;

export default function RadioGroupCards() {
  return (
    <RadioGroup defaultValue="cream" aria-label="Paper" className="max-w-md">
      {papers.map(([value, title, note]) => (
        <FieldLabel key={value} htmlFor={`rc-${value}`}>
          <Field orientation="horizontal">
            <FieldContent>
              <FieldTitle>{title}</FieldTitle>
              <FieldDescription>{note}</FieldDescription>
            </FieldContent>
            <RadioGroupItem value={value} id={`rc-${value}`} seed={`rc-${value}`} />
          </Field>
        </FieldLabel>
      ))}
    </RadioGroup>
  );
}
