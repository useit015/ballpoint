import { Field, FieldContent, FieldDescription, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Label } from "@/registry/ballpoint/ui/label";
import { Switch } from "@/registry/ballpoint/ui/switch";

export default function SwitchDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel htmlFor="switch-draw">Draw things in</FieldLabel>
          <FieldDescription>Strokes draw themselves the first time they scroll into view.</FieldDescription>
        </FieldContent>
        <Switch id="switch-draw" defaultChecked seed="switch-draw" />
      </Field>
      <div className="flex flex-wrap items-center gap-6">
        <Label>
          <Switch seed="switch-off" />
          Off
        </Label>
        <Label>
          <Switch size="sm" defaultChecked seed="switch-sm" />
          Small
        </Label>
        <Label>
          <Switch fill="hatch" defaultChecked seed="switch-hatch" />
          Hatched
        </Label>
        <Label>
          <Switch fill="flat" defaultChecked seed="switch-flat" />
          Flat
        </Label>
        <Label>
          <Switch disabled seed="switch-disabled" />
          Disabled
        </Label>
      </div>
    </div>
  );
}
