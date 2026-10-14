import { Button } from "@/registry/ballpoint/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ballpoint/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Input } from "@/registry/ballpoint/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ballpoint/ui/tabs";

export default function TabsSettings() {
  return (
    <Tabs defaultValue="account" className="w-full max-w-md">
      <TabsList seed="ts-list">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <Card seed="ts-account">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Your name and the address on your letters.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="ts-name">Name</FieldLabel>
                <Input id="ts-name" defaultValue="Grace Hopper" seed="ts-name" />
              </Field>
              <Field>
                <FieldLabel htmlFor="ts-user">Username</FieldLabel>
                <Input id="ts-user" defaultValue="@grace" seed="ts-user" />
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button seed="ts-save">Save changes</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="password">
        <Card seed="ts-password">
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>Use a long one. You will be signed out after.</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="ts-current">Current</FieldLabel>
                <Input id="ts-current" type="password" seed="ts-current" />
              </Field>
              <Field>
                <FieldLabel htmlFor="ts-new">New</FieldLabel>
                <Input id="ts-new" type="password" seed="ts-new" />
              </Field>
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <Button seed="ts-pw-save">Change password</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
