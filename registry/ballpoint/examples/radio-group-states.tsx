import { Field, FieldDescription, FieldError, FieldLabel, FieldLegend, FieldSet } from "@/registry/ballpoint/ui/field";
import { Label } from "@/registry/ballpoint/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/ballpoint/ui/radio-group";

export default function RadioGroupStates() {
  return (
    <div className="grid w-full max-w-md gap-8">
      <RadioGroup defaultValue="day" aria-label="Time" className="flex flex-wrap gap-6">
        <Label>
          <RadioGroupItem value="day" seed="rs-day" />
          Day
        </Label>
        <Label>
          <RadioGroupItem value="night" seed="rs-night" />
          Night
        </Label>
        <Label>
          <RadioGroupItem value="dusk" disabled seed="rs-dusk" />
          Dusk
        </Label>
      </RadioGroup>
      <FieldSet data-invalid>
        <FieldLegend variant="label">Delivery</FieldLegend>
        <FieldDescription>Choose one before you continue.</FieldDescription>
        <RadioGroup aria-label="Delivery" aria-invalid>
          {["Post", "Courier"].map((option) => (
            <Field key={option} orientation="horizontal" data-invalid>
              <RadioGroupItem value={option.toLowerCase()} id={`rs-${option}`} aria-invalid seed={`rs-${option}`} />
              <FieldLabel htmlFor={`rs-${option}`}>{option}</FieldLabel>
            </Field>
          ))}
        </RadioGroup>
        <FieldError>Pick a delivery option.</FieldError>
      </FieldSet>
    </div>
  );
}
