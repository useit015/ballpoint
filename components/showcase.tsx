"use client";

import { Badge } from "@/registry/ballpoint/ui/badge";
import { Button } from "@/registry/ballpoint/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ballpoint/ui/card";
import { Field, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";
import { Label } from "@/registry/ballpoint/ui/label";
import { Progress, ProgressLabel, ProgressValue } from "@/registry/ballpoint/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/registry/ballpoint/ui/radio-group";
import { Switch } from "@/registry/ballpoint/ui/switch";

/** A few components working together, for the front page. */
export function Showcase() {
  return (
    <div className="flex flex-col gap-8">
      <Card seed="show-card">
        <CardHeader>
          <CardTitle>Book a call</CardTitle>
          <CardDescription>Thirty minutes, no slides.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Field>
            <FieldLabel htmlFor="show-email">Email</FieldLabel>
            <Input id="show-email" type="email" placeholder="you@example.com" seed="show-email" />
          </Field>
          <RadioGroup defaultValue="morning" aria-label="Time of day" className="flex flex-wrap gap-x-6 gap-y-2">
            <Label>
              <RadioGroupItem value="morning" seed="show-morning" />
              Morning
            </Label>
            <Label>
              <RadioGroupItem value="afternoon" seed="show-afternoon" />
              Afternoon
            </Label>
          </RadioGroup>
          <Label>
            <Switch defaultChecked seed="show-switch" />
            Remind me the day before
          </Label>
        </CardContent>
        <CardFooter>
          <Button seed="show-book">Book it</Button>
          <Button variant="ghost" seed="show-later">
            Not now
          </Button>
        </CardFooter>
      </Card>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-1">
        <Badge seed="show-new">New</Badge>
        <Badge variant="secondary" seed="show-draft">
          Draft
        </Badge>
        <Badge variant="outline" seed="show-version">
          v1.0
        </Badge>
        <Progress value={64} seed="show-progress" className="ml-auto w-44">
          <ProgressLabel className="text-sm">Ink left</ProgressLabel>
          <ProgressValue />
        </Progress>
      </div>
    </div>
  );
}
