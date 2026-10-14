import { Label } from "@/registry/ballpoint/ui/label";
import { Switch } from "@/registry/ballpoint/ui/switch";

const sizes = ["sm", "default", "lg"] as const;

export default function SwitchSizes() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-8">
        {sizes.map((size) => (
          <Label key={size}>
            <Switch size={size} defaultChecked seed={`ssz-${size}`} />
            {size}
          </Label>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-8">
        <Label>
          <Switch size="lg" disabled seed="ssz-off" />
          Disabled
        </Label>
        <Label>
          <Switch size="lg" disabled defaultChecked seed="ssz-on" />
          Disabled, on
        </Label>
        <Label>
          <Switch size="lg" aria-invalid seed="ssz-invalid" />
          Invalid
        </Label>
      </div>
    </div>
  );
}
