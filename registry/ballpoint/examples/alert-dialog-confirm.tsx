"use client";

import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/registry/ballpoint/ui/alert-dialog";
import { Button } from "@/registry/ballpoint/ui/button";

export default function AlertDialogConfirm() {
  const [pages, setPages] = useState(48);
  return (
    <div className="flex flex-col items-center gap-4">
      <p className="text-ink-2">{pages ? `${pages} pages in this notebook.` : "The notebook is empty."}</p>
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline" disabled={!pages} seed="adc-open" />}>Tear out 12 pages</AlertDialogTrigger>
        <AlertDialogContent size="sm" seed="adc">
          <AlertDialogHeader>
            <AlertDialogTitle>Tear out 12 pages?</AlertDialogTitle>
            <AlertDialogDescription>They go to the bin, where they stay for 30 days.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel seed="adc-cancel">Keep them</AlertDialogCancel>
            <AlertDialogAction onClick={() => setPages((n) => Math.max(0, n - 12))} seed="adc-confirm">
              Tear out
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
