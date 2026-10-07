import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ballpoint/ui/tabs";

export default function TabsVertical() {
  return (
    <Tabs defaultValue="profile" orientation="vertical" className="w-full max-w-md gap-6">
      <TabsList variant="line" seed="tv-list">
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="billing">Billing</TabsTrigger>
        <TabsTrigger value="team">Team</TabsTrigger>
      </TabsList>
      <TabsContent value="profile" className="text-ink-2">
        Your name, photo and the address on your letters.
      </TabsContent>
      <TabsContent value="billing" className="text-ink-2">
        Receipts, and the card the ink is charged to.
      </TabsContent>
      <TabsContent value="team" className="text-ink-2">
        Who else can write in the notebook.
      </TabsContent>
    </Tabs>
  );
}
