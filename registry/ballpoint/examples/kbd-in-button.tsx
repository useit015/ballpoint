import { Button } from "@/registry/ballpoint/ui/button";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";
import { Kbd } from "@/registry/ballpoint/ui/kbd";

export default function KbdInButton() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <Button variant="outline" seed="kb-search">
        <InkIcon name="search" /> Search <Kbd seed="kb-slash">/</Kbd>
      </Button>
      <Button seed="kb-save">
        Save <Kbd seed="kb-save-key" className="text-primary-foreground">⌘S</Kbd>
      </Button>
    </div>
  );
}
