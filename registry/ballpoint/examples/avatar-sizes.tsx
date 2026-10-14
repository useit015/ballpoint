import { Avatar, AvatarFallback } from "@/registry/ballpoint/ui/avatar";

const sizes = ["sm", "default", "lg", "xl"] as const;

export default function AvatarSizes() {
  return (
    <div className="flex items-end gap-6">
      {sizes.map((size) => (
        <figure key={size} className="flex flex-col items-center gap-2">
          <Avatar size={size} seed={`asz-${size}`}>
            <AvatarFallback>GH</AvatarFallback>
          </Avatar>
          <figcaption className="font-mono text-sm text-ink-3">{size}</figcaption>
        </figure>
      ))}
    </div>
  );
}
