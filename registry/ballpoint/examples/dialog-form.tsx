"use client";

import { Button } from "@/registry/ballpoint/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/ballpoint/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";
import { Textarea } from "@/registry/ballpoint/ui/textarea";

export default function DialogForm() {
  return (
    <Dialog>
      <DialogTrigger render={<Button seed="df-open" />}>Edit profile</DialogTrigger>
      <DialogContent size="lg" seed="df">
        <form className="grid gap-5" onSubmit={(event) => event.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>How you appear on the letters you send.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="df-first">First name</FieldLabel>
                <Input id="df-first" defaultValue="Grace" seed="df-first" />
              </Field>
              <Field>
                <FieldLabel htmlFor="df-last">Last name</FieldLabel>
                <Input id="df-last" defaultValue="Hopper" seed="df-last" />
              </Field>
            </div>
            <Field>
              <FieldLabel htmlFor="df-bio">About you</FieldLabel>
              <Textarea id="df-bio" rows={3} defaultValue="Writing since 1952." seed="df-bio" />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" seed="df-cancel" />}>Cancel</DialogClose>
            <DialogClose render={<Button type="submit" seed="df-save" />}>Save changes</DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
