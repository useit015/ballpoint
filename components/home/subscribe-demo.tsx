"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { Annotate, type AnnotateType } from "@/registry/ballpoint/ui/annotate";
import { Button } from "@/registry/ballpoint/ui/button";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Input } from "@/registry/ballpoint/ui/input";
import { Label } from "@/registry/ballpoint/ui/label";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

export type Part = "input" | "checkbox" | "button";

/** A part of the form: marked in red pen while it is the one pointed at (in the code, or here). */
function Mark({ part, current, onPart, type, className, children }: { part: Part; current: Part | null; onPart: (part: Part | null) => void; type: AnnotateType; className?: string; children: ReactNode }) {
  return (
    <div
      data-part={part}
      className={className}
      onPointerEnter={() => onPart(part)}
      onPointerLeave={() => onPart(null)}
      onFocusCapture={() => onPart(part)}
      onBlurCapture={() => onPart(null)}
    >
      <Annotate type={type} color="red" active={current === part} seed={`api-mark-${part}`} className="block w-fit max-w-full">
        {children}
      </Annotate>
    </div>
  );
}

/** What the code beside it draws, and it works: nothing is sent anywhere. */
export function SubscribeDemo({ part, onPart }: { part: Part | null; onPart: (part: Part | null) => void }) {
  const [state, setState] = useState<"idle" | "done">("idle");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setState("done");
  };
  return (
    <form onSubmit={submit} onChange={() => setState("idle")} className="api-form">
      <div className="grid gap-1.5">
        <Label htmlFor="api-email">Email</Label>
        <Mark part="input" current={part} onPart={onPart} type="bracket" className="w-full">
          <Input id="api-email" type="email" required placeholder="you@domain.com" seed="api-email" className="w-[min(28rem,70vw)]" />
        </Mark>
      </div>
      <Mark part="checkbox" current={part} onPart={onPart} type="circle">
        <Label className="w-fit px-1">
          <Checkbox defaultChecked seed="api-updates" />
          Send me updates
        </Label>
      </Mark>
      <Mark part="button" current={part} onPart={onPart} type="box">
        <Button type="submit" seed="api-subscribe" className="w-fit">
          {state === "done" ? (
            <>
              Subscribed <InkGlyph name="check" draw="mount" />
            </>
          ) : (
            "Subscribe"
          )}
        </Button>
      </Mark>
      <p className="api-note" aria-live="polite">
        {state === "done" ? "Only a demo: nothing was sent." : "Try it. Nothing is sent."}
      </p>
    </form>
  );
}
