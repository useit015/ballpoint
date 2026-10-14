"use client";

import { Button } from "@/registry/ballpoint/ui/button";
import { Field, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/registry/ballpoint/ui/popover";

export default function PopoverForm() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" seed="pf-open" />}>Page size</PopoverTrigger>
      <PopoverContent seed="pf" className="w-72">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the size of the page, in millimetres.</PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-3">
          {[
            ["Width", 148],
            ["Height", 210],
          ].map(([label, value]) => (
            <Field key={label} orientation="horizontal">
              <FieldLabel htmlFor={`pf-${label}`} className="w-16">
                {label}
              </FieldLabel>
              <Input id={`pf-${label}`} type="number" defaultValue={value} seed={`pf-${label}`} />
            </Field>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
