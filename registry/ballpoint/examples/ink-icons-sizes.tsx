import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";

export default function InkIconsSizes() {
  return (
    <div className="flex items-end gap-8 text-ink">
      {["size-4", "size-6", "size-8", "size-12"].map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <InkIcon name="pencil" className={size} />
          <span className="text-xs text-ink-3">{size}</span>
        </div>
      ))}
      <div className="flex flex-col items-center gap-2 text-destructive">
        <InkIcon name="heart" className="size-8" />
        <span className="text-xs text-ink-3">red pen</span>
      </div>
    </div>
  );
}
