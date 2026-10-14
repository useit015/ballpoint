import { Badge } from "@/registry/ballpoint/ui/badge";

const sizes = ["sm", "default", "lg"] as const;

export default function BadgeSizes() {
  return (
    <div className="flex flex-col gap-6">
      {(["default", "secondary", "outline"] as const).map((variant) => (
        <div key={variant} className="flex flex-wrap items-center gap-4">
          {sizes.map((size) => (
            <Badge key={size} variant={variant} size={size} seed={`bs-${variant}-${size}`}>
              {size}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  );
}
