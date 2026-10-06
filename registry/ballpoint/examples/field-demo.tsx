import { Button } from "@/registry/ballpoint/ui/button";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";
import { RadioGroup, RadioGroupItem } from "@/registry/ballpoint/ui/radio-group";
import { Switch } from "@/registry/ballpoint/ui/switch";
import { Textarea } from "@/registry/ballpoint/ui/textarea";

export default function FieldDemo() {
  return (
    <form className="w-full max-w-lg">
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Book a call</FieldLegend>
          <FieldDescription>Thirty minutes, no slides.</FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="form-name">Name</FieldLabel>
              <Input id="form-name" placeholder="Ada Lovelace" seed="form-name" />
            </Field>
            <Field data-invalid>
              <FieldLabel htmlFor="form-email">Email</FieldLabel>
              <Input id="form-email" type="email" defaultValue="ada@" aria-invalid seed="form-email" />
              <FieldError>That email is missing its domain.</FieldError>
            </Field>
            <Field>
              <FieldLabel htmlFor="form-about">What&apos;s it about?</FieldLabel>
              <Textarea id="form-about" placeholder="A sentence or two is plenty." seed="form-about" />
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator>When</FieldSeparator>
        <FieldSet>
          <FieldLegend variant="label">Time of day</FieldLegend>
          <RadioGroup defaultValue="morning">
            {["Morning", "Afternoon"].map((t) => (
              <Field key={t} orientation="horizontal">
                <RadioGroupItem value={t.toLowerCase()} id={`form-${t}`} seed={`form-${t}`} />
                <FieldLabel htmlFor={`form-${t}`}>{t}</FieldLabel>
              </Field>
            ))}
          </RadioGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="form-remind">Remind me</FieldLabel>
            <FieldDescription>An email the day before.</FieldDescription>
          </FieldContent>
          <Switch id="form-remind" defaultChecked seed="form-remind" />
        </Field>
        <Field orientation="horizontal">
          <Checkbox id="form-terms" seed="form-terms" />
          <FieldLabel htmlFor="form-terms">I&apos;ve read the small print</FieldLabel>
        </Field>
        <Field orientation="horizontal">
          <Button type="submit" seed="form-submit">
            Send
          </Button>
          <Button variant="ghost" type="reset" seed="form-reset">
            Clear
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
