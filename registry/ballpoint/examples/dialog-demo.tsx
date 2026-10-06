import { Button } from "@/registry/ballpoint/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/ballpoint/ui/dialog";
import { Field, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" seed="dialog-open" />}>Edit profile</DialogTrigger>
      <DialogContent seed="dialog">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>How your name and handle appear on your notes. Save when you&apos;re done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <Field>
            <FieldLabel htmlFor="dialog-name">Name</FieldLabel>
            <Input id="dialog-name" defaultValue="Ada Lovelace" seed="dialog-name" />
          </Field>
          <Field>
            <FieldLabel htmlFor="dialog-handle">Handle</FieldLabel>
            <Input id="dialog-handle" defaultValue="@ada" seed="dialog-handle" />
          </Field>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" seed="dialog-cancel" />}>Cancel</DialogClose>
          <DialogClose render={<Button seed="dialog-save" />}>Save changes</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
