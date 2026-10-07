import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/registry/ballpoint/ui/field";
import { Switch } from "@/registry/ballpoint/ui/switch";

const settings = [
  ["draw", "Draw things in", "Strokes draw themselves as they scroll into view.", true],
  ["night", "Follow the lamp", "Switch to the night paper after dark.", true],
  ["sound", "Pen scratch", "A quiet scratch while a line is drawn.", false],
] as const;

export default function FieldSettings() {
  return (
    <FieldSet className="w-full max-w-md">
      <FieldLegend>Pen settings</FieldLegend>
      <FieldGroup className="gap-5">
        {settings.map(([id, title, description, on], i) => (
          <div key={id} className="contents">
            {i > 0 && <FieldSeparator />}
            <Field orientation="horizontal">
              <FieldContent>
                <FieldLabel htmlFor={`fs-${id}`}>{title}</FieldLabel>
                <FieldDescription>{description}</FieldDescription>
              </FieldContent>
              <Switch id={`fs-${id}`} defaultChecked={on} seed={`fs-${id}`} />
            </Field>
          </div>
        ))}
      </FieldGroup>
    </FieldSet>
  );
}
