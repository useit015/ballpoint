"use client";

import { useState } from "react";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/registry/ballpoint/ui/alert";
import { Button } from "@/registry/ballpoint/ui/button";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

export default function AlertDismiss() {
  const [open, setOpen] = useState(true);
  return (
    <div className="flex w-full max-w-xl flex-col items-start gap-4">
      {open ? (
        <Alert variant="note" seed="ad-note">
          <InkGlyph name="info-circle" />
          <AlertTitle>Autosave is on</AlertTitle>
          <AlertDescription>Your page is saved as you write. Turn it off in settings.</AlertDescription>
          <AlertAction>
            <Button variant="ghost" size="icon-sm" seed="ad-close" onClick={() => setOpen(false)}>
              <InkGlyph name="close" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </AlertAction>
        </Alert>
      ) : (
        <p className="text-ink-2">Dismissed.</p>
      )}
      {!open && (
        <Button variant="outline" size="sm" seed="ad-undo" onClick={() => setOpen(true)}>
          Bring it back
        </Button>
      )}
    </div>
  );
}
