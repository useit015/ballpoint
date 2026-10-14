import { Button } from "@/registry/ballpoint/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/ballpoint/ui/dialog";

const sizes = ["sm", "default", "lg", "xl"] as const;

export default function DialogSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {sizes.map((size) => (
        <Dialog key={size}>
          <DialogTrigger render={<Button variant="outline" seed={`dz-${size}`} />}>{size}</DialogTrigger>
          <DialogContent size={size} seed={`dz-c-${size}`}>
            <DialogHeader>
              <DialogTitle>size=&quot;{size}&quot;</DialogTitle>
              <DialogDescription>The dialog is as wide as it needs to be, and never wider than the screen.</DialogDescription>
            </DialogHeader>
            <DialogFooter showCloseButton />
          </DialogContent>
        </Dialog>
      ))}
    </div>
  );
}
