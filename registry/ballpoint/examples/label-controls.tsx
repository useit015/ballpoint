import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Input } from "@/registry/ballpoint/ui/input";
import { Label } from "@/registry/ballpoint/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/ballpoint/ui/radio-group";
import { Switch } from "@/registry/ballpoint/ui/switch";

export default function LabelControls() {
  return (
    <div className="grid w-full max-w-md gap-7">
      <div className="grid gap-2">
        <Label htmlFor="lc-name">
          Name <span className="text-destructive">*</span>
        </Label>
        <Input id="lc-name" required placeholder="Required" seed="lc-name" />
      </div>
      <Label>
        <Switch defaultChecked seed="lc-switch" />
        Wrap the label around the control
      </Label>
      <RadioGroup defaultValue="a" aria-label="Choice" className="flex flex-wrap gap-6">
        <Label>
          <RadioGroupItem value="a" seed="lc-a" />
          Option A
        </Label>
        <Label>
          <RadioGroupItem value="b" seed="lc-b" />
          Option B
        </Label>
      </RadioGroup>
      <Label>
        <Checkbox disabled seed="lc-disabled" />
        Dims with its disabled control
      </Label>
    </div>
  );
}
