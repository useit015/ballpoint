import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/registry/ballpoint/ui/tabs";

export default function TabsIcons() {
  return (
    <Tabs defaultValue="notes" className="w-full max-w-md">
      <TabsList seed="ti-list">
        <TabsTrigger value="notes">
          <InkIcon name="pencil" className="size-4" /> Notes
        </TabsTrigger>
        <TabsTrigger value="photos">
          <InkIcon name="image" className="size-4" /> Photos
        </TabsTrigger>
        <TabsTrigger value="files">
          <InkIcon name="folder" className="size-4" /> Files
        </TabsTrigger>
      </TabsList>
      <TabsContent value="notes" className="text-ink-2">
        Scribbles and lists.
      </TabsContent>
      <TabsContent value="photos" className="text-ink-2">
        Pictures pasted in.
      </TabsContent>
      <TabsContent value="files" className="text-ink-2">
        Everything else, in folders.
      </TabsContent>
    </Tabs>
  );
}
