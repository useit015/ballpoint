"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/ballpoint/ui/dialog";
import { Field, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";

// Own the open state to close the dialog from your own code, here when the form is submitted.
export default function DialogControlled() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Untitled");
  const [saved, setSaved] = useState<string>();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    setSaved(name);
    setOpen(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={<Button variant="outline" seed="dc-open" />}>Rename notebook</DialogTrigger>
        <DialogContent seed="dc">
          <form onSubmit={submit} className="grid gap-5">
            <DialogHeader>
              <DialogTitle>Rename notebook</DialogTitle>
              <DialogDescription>Press Enter to save.</DialogDescription>
            </DialogHeader>
            <Field>
              <FieldLabel htmlFor="dc-name">Name</FieldLabel>
              <Input id="dc-name" value={name} onChange={(e) => setName(e.target.value)} seed="dc-name" />
            </Field>
            <DialogFooter>
              <DialogClose render={<Button variant="outline" type="button" seed="dc-cancel" />}>Cancel</DialogClose>
              <Button type="submit" seed="dc-save">
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {saved && <p className="text-ink-2">Saved as “{saved}”.</p>}
    </div>
  );
}
