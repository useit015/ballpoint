import { Button } from "@/registry/ballpoint/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ballpoint/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";

export default function CardForm() {
  return (
    <Card className="w-full max-w-sm" seed="cf-card">
      <CardHeader>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Use the email you booked with.</CardDescription>
      </CardHeader>
      <CardContent>
        <form id="cf-form">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="cf-email">Email</FieldLabel>
              <Input id="cf-email" type="email" placeholder="you@example.com" seed="cf-email" />
            </Field>
            <Field>
              <FieldLabel htmlFor="cf-password">Password</FieldLabel>
              <Input id="cf-password" type="password" seed="cf-password" />
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full flex-col items-center gap-3">
          <Button type="submit" form="cf-form" className="w-full" seed="cf-submit">
            Sign in
          </Button>
          <Button variant="link" seed="cf-forgot">
            Forgot your password?
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
