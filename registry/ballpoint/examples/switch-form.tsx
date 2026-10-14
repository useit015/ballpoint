"use client";

import { useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Switch } from "@/registry/ballpoint/ui/switch";

export default function SwitchForm() {
  const [terms, setTerms] = useState(false);
  const [news, setNews] = useState(true);
  const [sent, setSent] = useState(false);
  return (
    <form
      className="w-full max-w-md"
      onSubmit={(event) => {
        event.preventDefault();
        setSent(terms);
      }}
    >
      <FieldGroup>
        <Field orientation="horizontal" data-invalid={!terms && undefined}>
          <FieldContent>
            <FieldLabel htmlFor="sf-terms">Accept the terms</FieldLabel>
            <FieldDescription>Required before we can post you a notebook.</FieldDescription>
            {!terms && <FieldError>You need to accept to continue.</FieldError>}
          </FieldContent>
          <Switch id="sf-terms" checked={terms} onCheckedChange={setTerms} aria-invalid={!terms} seed="sf-terms" />
        </Field>
        <Field orientation="horizontal">
          <FieldContent>
            <FieldLabel htmlFor="sf-news">Send me the newsletter</FieldLabel>
            <FieldDescription>One email a month, hand-written in spirit.</FieldDescription>
          </FieldContent>
          <Switch id="sf-news" checked={news} onCheckedChange={setNews} seed="sf-news" />
        </Field>
        <div className="flex items-center gap-4">
          <Button type="submit" seed="sf-submit">
            Continue
          </Button>
          {sent && <span className="text-ink-2">Thanks, it&apos;s on its way.</span>}
        </div>
      </FieldGroup>
    </form>
  );
}
