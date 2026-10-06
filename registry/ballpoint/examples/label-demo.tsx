import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Label } from "@/registry/ballpoint/ui/label";

export default function LabelDemo() {
  return (
    <Label>
      <Checkbox seed="label-terms" />
      Accept the terms
    </Label>
  );
}
