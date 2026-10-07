import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldTitle } from "@/registry/ballpoint/ui/field";

const extras = [
  ["gift", "Gift wrap", "Tied with string."],
  ["note", "Handwritten note", "In blue ballpoint, naturally."],
  ["express", "Express post", "Arrives in two days."],
] as const;

// Wrap a whole Field in FieldLabel and the entire row becomes the click target.
export default function CheckboxCards() {
  return (
    <FieldGroup className="w-full max-w-md gap-4">
      {extras.map(([id, title, description], i) => (
        <FieldLabel key={id} htmlFor={`cc-${id}`}>
          <Field orientation="horizontal">
            <Checkbox id={`cc-${id}`} defaultChecked={i === 1} seed={`cc-${id}`} />
            <FieldContent>
              <FieldTitle>{title}</FieldTitle>
              <FieldDescription>{description}</FieldDescription>
            </FieldContent>
          </Field>
        </FieldLabel>
      ))}
    </FieldGroup>
  );
}
