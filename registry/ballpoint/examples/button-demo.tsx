import { Button } from "@/registry/ballpoint/ui/button";

const variants = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const;
const sizes = ["xs", "sm", "default", "lg"] as const;
const iconSize = { xs: "icon-xs", sm: "icon-sm", default: "icon", lg: "icon-lg" } as const;

export default function ButtonDemo() {
  return (
    <div className="flex flex-col gap-8">
      {sizes.map((size) => (
        <div key={size} className="flex flex-wrap items-center gap-5">
          {variants.map((variant) => (
            <Button key={variant} variant={variant} size={size} seed={`${variant}-${size}`}>
              {variant === "default" ? "Book a call" : variant}
            </Button>
          ))}
          <Button variant="outline" size={iconSize[size]} seed={`icon-${size}`} aria-label="Add">
            +
          </Button>
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-5">
        <Button draw="mount" seed="mount">
          Draws itself in
        </Button>
        <Button variant="outline" seed="disabled" disabled>
          Disabled
        </Button>
      </div>
    </div>
  );
}
