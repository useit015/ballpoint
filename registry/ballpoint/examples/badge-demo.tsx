import { Badge } from "@/registry/ballpoint/ui/badge";

export default function BadgeDemo() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Badge seed="badge-default">New</Badge>
      <Badge variant="secondary" seed="badge-secondary">
        Draft
      </Badge>
      <Badge variant="outline" seed="badge-outline">
        v1.2
      </Badge>
      <Badge variant="destructive" seed="badge-destructive">
        Overdue
      </Badge>
      <Badge variant="ghost" seed="badge-ghost">
        Hover me
      </Badge>
      <Badge variant="link" render={<a href="#badge" />} seed="badge-link">
        A link
      </Badge>
      <Badge radius={4} roughness={1.6} seed="badge-square">
        Boxed
      </Badge>
    </div>
  );
}
