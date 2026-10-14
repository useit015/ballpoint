import { Button } from "@/registry/ballpoint/ui/button";
import { CopyButton } from "@/registry/ballpoint/ui/copy-button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/ballpoint/ui/dialog";
import { Input } from "@/registry/ballpoint/ui/input";

export default function DialogShare() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" seed="dsh-open" />}>Share</DialogTrigger>
      <DialogContent size="sm" seed="dsh">
        <DialogHeader>
          <DialogTitle>Share this notebook</DialogTitle>
          <DialogDescription>Anyone with the link can read it. Nobody can write in it.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2">
          <Input readOnly aria-label="Link" defaultValue="https://example.com/n/4fK9q" seed="dsh-link" className="min-w-0 flex-1" />
          <CopyButton value="https://example.com/n/4fK9q" variant="outline" size="icon" seed="dsh-copy">
            Copy link
          </CopyButton>
        </div>
        <DialogFooter showCloseButton />
      </DialogContent>
    </Dialog>
  );
}
