import { Badge } from "@/registry/ballpoint/ui/badge";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

export default function BadgeIcons() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Badge seed="bi-verified">
        <InkGlyph name="check" /> Verified
      </Badge>
      <Badge variant="secondary" seed="bi-info">
        <InkGlyph name="info" /> Heads up
      </Badge>
      <Badge variant="destructive" seed="bi-alert">
        <InkGlyph name="alert" /> Failed
      </Badge>
      <Badge variant="outline" seed="bi-count">
        Unread · 12
      </Badge>
    </div>
  );
}
