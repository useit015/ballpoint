"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/ballpoint/ui/card";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Switch } from "@/registry/ballpoint/ui/switch";

export default function SwitchSettings() {
  const [reminders, setReminders] = useState(true);
  return (
    <Card className="w-full max-w-md" seed="ss-card">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Reminders are {reminders ? "on" : "off"}.</CardDescription>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-5">
          <Field orientation="horizontal">
            <FieldContent>
              <FieldLabel htmlFor="ss-reminders">Reminders</FieldLabel>
              <FieldDescription>An email the day before.</FieldDescription>
            </FieldContent>
            <Switch id="ss-reminders" checked={reminders} onCheckedChange={setReminders} seed="ss-reminders" />
          </Field>
          <Field orientation="horizontal" data-disabled>
            <FieldContent>
              <FieldLabel htmlFor="ss-digest">Weekly digest</FieldLabel>
              <FieldDescription>Coming soon.</FieldDescription>
            </FieldContent>
            <Switch id="ss-digest" disabled seed="ss-digest" />
          </Field>
        </FieldGroup>
      </CardContent>
    </Card>
  );
}
