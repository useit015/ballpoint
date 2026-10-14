"use client";

import { Button } from "@/registry/ballpoint/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/ballpoint/ui/sheet";
import { Switch } from "@/registry/ballpoint/ui/switch";

export default function SheetForm() {
  return (
    <Sheet>
      <SheetTrigger render={<Button seed="sf-open" />}>Edit pen</SheetTrigger>
      <SheetContent size="lg" seed="sf">
        <SheetHeader>
          <SheetTitle>Edit pen</SheetTitle>
          <SheetDescription>Change how this pen writes. Saved when you press the button.</SheetDescription>
        </SheetHeader>
        <form className="grid gap-5 px-6" onSubmit={(event) => event.preventDefault()}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="sf-name">Name</FieldLabel>
              <Input id="sf-name" defaultValue="Blue ballpoint" seed="sf-name" />
            </Field>
            <Field>
              <FieldLabel htmlFor="sf-weight">Line weight</FieldLabel>
              <Input id="sf-weight" type="number" defaultValue={1.2} step={0.1} seed="sf-weight" />
            </Field>
            <Field orientation="horizontal">
              <FieldLabel htmlFor="sf-night">Lighter at night</FieldLabel>
              <Switch id="sf-night" defaultChecked seed="sf-night" />
            </Field>
          </FieldGroup>
        </form>
        <SheetFooter>
          <SheetClose render={<Button seed="sf-save" />}>Save pen</SheetClose>
          <SheetClose render={<Button variant="outline" seed="sf-cancel" />}>Cancel</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
