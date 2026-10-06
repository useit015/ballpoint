import { Button } from "@/registry/ballpoint/ui/button";
import { Field, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/ballpoint/ui/sheet";

const sides = ["right", "left", "top", "bottom"] as const;

export default function SheetDemo() {
  return (
    <div className="flex flex-wrap gap-5">
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline" className="capitalize" seed={`sheet-${side}`} />}>{side}</SheetTrigger>
          <SheetContent side={side} seed={`sheet-${side}-edge`}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>How your name and handle appear on your notes.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 px-6">
              <Field>
                <FieldLabel htmlFor={`sheet-${side}-name`}>Name</FieldLabel>
                <Input id={`sheet-${side}-name`} defaultValue="Ada Lovelace" seed={`sheet-${side}-name`} />
              </Field>
            </div>
            <SheetFooter>
              <SheetClose render={<Button seed={`sheet-${side}-save`} />}>Save changes</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
