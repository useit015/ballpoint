import { Label } from "@/registry/ballpoint/ui/label";
import { RadioGroup, RadioGroupItem } from "@/registry/ballpoint/ui/radio-group";

const sizes = ["A6", "A5", "A4", "Letter"];

export default function RadioGroupHorizontal() {
  return (
    <div className="flex flex-col gap-3">
      <span id="rh-size" className="font-bold">
        Notebook size
      </span>
      <RadioGroup orientation="horizontal" defaultValue="A5" aria-labelledby="rh-size">
        {sizes.map((size) => (
          <Label key={size}>
            <RadioGroupItem value={size} seed={`rh-${size}`} />
            {size}
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}
