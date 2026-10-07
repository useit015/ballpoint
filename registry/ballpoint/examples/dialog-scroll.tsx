import { Button } from "@/registry/ballpoint/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/registry/ballpoint/ui/dialog";

const clauses = Array.from({ length: 12 }, (_, i) => `${i + 1}. The pen stays with its owner, and any lines drawn with it are drawn with care.`);

export default function DialogScroll() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" seed="dsc-open" />}>Read the terms</DialogTrigger>
      <DialogContent seed="dsc">
        <DialogHeader>
          <DialogTitle>Terms of the pen</DialogTitle>
          <DialogDescription>Scroll to the end, then accept.</DialogDescription>
        </DialogHeader>
        <div tabIndex={0} aria-label="Terms" className="max-h-60 overflow-y-auto pr-2 text-ink-2">
          {clauses.map((clause) => (
            <p key={clause} className="mb-3">
              {clause}
            </p>
          ))}
        </div>
        <DialogFooter>
          <DialogClose render={<Button seed="dsc-accept" />}>I accept</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
