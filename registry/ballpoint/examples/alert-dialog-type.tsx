"use client";

import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/registry/ballpoint/ui/alert-dialog";
import { Button } from "@/registry/ballpoint/ui/button";
import { Field, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";

const NAME = "Field notes";

export default function AlertDialogType() {
  const [typed, setTyped] = useState("");
  const [gone, setGone] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <AlertDialog onOpenChange={() => setTyped("")}>
        <AlertDialogTrigger render={<Button variant="destructive" seed="adt-open" disabled={gone} />}>Delete notebook</AlertDialogTrigger>
        <AlertDialogContent seed="adt">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{NAME}”?</AlertDialogTitle>
            <AlertDialogDescription>All 96 pages go with it, and they do not come back. Type the name to be sure.</AlertDialogDescription>
          </AlertDialogHeader>
          <Field>
            <FieldLabel htmlFor="adt-name">Notebook name</FieldLabel>
            <Input id="adt-name" value={typed} onChange={(event) => setTyped(event.target.value)} placeholder={NAME} seed="adt-name" />
          </Field>
          <AlertDialogFooter>
            <AlertDialogCancel seed="adt-cancel">Keep it</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={typed !== NAME} onClick={() => setGone(true)} seed="adt-go">
              Delete for good
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {gone && <p className="text-ink-2">“{NAME}” is gone.</p>}
    </div>
  );
}
