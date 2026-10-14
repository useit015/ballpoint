import { Button } from "@/registry/ballpoint/ui/button";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";
import { Separator } from "@/registry/ballpoint/ui/separator";

export default function SeparatorToolbar() {
  return (
    <div role="toolbar" aria-label="Formatting" className="flex h-9 items-center gap-1">
      <Button variant="ghost" size="icon-sm" seed="st-bold">
        <InkIcon name="bold" />
        <span className="sr-only">Bold</span>
      </Button>
      <Button variant="ghost" size="icon-sm" seed="st-italic">
        <InkIcon name="italic" />
        <span className="sr-only">Italic</span>
      </Button>
      <Button variant="ghost" size="icon-sm" seed="st-underline">
        <InkIcon name="underline" />
        <span className="sr-only">Underline</span>
      </Button>
      <Separator orientation="vertical" seed="st-a" className="mx-2" />
      <Button variant="ghost" size="icon-sm" seed="st-left">
        <InkIcon name="align-left" />
        <span className="sr-only">Align left</span>
      </Button>
      <Button variant="ghost" size="icon-sm" seed="st-center">
        <InkIcon name="align-center" />
        <span className="sr-only">Align centre</span>
      </Button>
      <Separator orientation="vertical" seed="st-b" className="mx-2" />
      <Button variant="ghost" size="icon-sm" seed="st-link">
        <InkIcon name="link" />
        <span className="sr-only">Link</span>
      </Button>
    </div>
  );
}
