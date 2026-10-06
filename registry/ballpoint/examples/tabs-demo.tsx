import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ballpoint/ui/tabs";

export default function TabsDemo() {
  return (
    <div className="flex w-full flex-col gap-10">
      <Tabs defaultValue="account" className="max-w-md">
        <TabsList seed="tabs-box">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="text-ink-2">
          Your name and the address on your letters.
        </TabsContent>
        <TabsContent value="password" className="text-ink-2">
          Change it here. Use a long one.
        </TabsContent>
        <TabsContent value="notifications" className="text-ink-2">
          We write only when it matters.
        </TabsContent>
      </Tabs>
      <Tabs defaultValue="preview" className="max-w-md">
        <TabsList variant="line" seed="tabs-line">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="text-ink-2">
          The underline slides to the chosen tab and is redrawn to fit it.
        </TabsContent>
        <TabsContent value="code" className="text-ink-2">
          Same API as shadcn&apos;s tabs, on Base UI.
        </TabsContent>
        <TabsContent value="notes" className="text-ink-2">
          Nothing here yet.
        </TabsContent>
      </Tabs>
    </div>
  );
}
