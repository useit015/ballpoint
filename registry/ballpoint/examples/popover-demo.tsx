import { Button } from "@/registry/ballpoint/ui/button";
import { Field, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/registry/ballpoint/ui/popover";

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" seed="popover-open" />}>Page size</PopoverTrigger>
      <PopoverContent seed="popover" className="w-80">
        <PopoverHeader>
          <PopoverTitle>Page size</PopoverTitle>
          <PopoverDescription>In millimetres, before trimming.</PopoverDescription>
        </PopoverHeader>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="popover-width" className="w-20">
            Width
          </FieldLabel>
          <Input id="popover-width" defaultValue="148" seed="popover-width" />
        </Field>
        <Field orientation="horizontal">
          <FieldLabel htmlFor="popover-height" className="w-20">
            Height
          </FieldLabel>
          <Input id="popover-height" defaultValue="210" seed="popover-height" />
        </Field>
      </PopoverContent>
    </Popover>
  );
}
