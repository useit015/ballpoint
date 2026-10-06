import { Separator } from "@/registry/ballpoint/ui/separator";

export default function SeparatorDemo() {
  return (
    <div className="w-full max-w-sm">
      <p className="text-lg font-bold">Ballpoint</p>
      <p className="text-ink-3">Components drawn in blue ballpoint.</p>
      <Separator className="my-4" seed="sep-h" />
      <div className="flex h-6 items-center gap-4">
        <span>Docs</span>
        <Separator orientation="vertical" seed="sep-v1" />
        <span>Components</span>
        <Separator orientation="vertical" seed="sep-v2" />
        <span>Source</span>
      </div>
    </div>
  );
}
