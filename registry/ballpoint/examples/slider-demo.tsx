import { Label } from "@/registry/ballpoint/ui/label";
import { Slider } from "@/registry/ballpoint/ui/slider";

export default function SliderDemo() {
  return (
    <div className="flex w-full max-w-md items-stretch gap-10">
      <div className="flex flex-1 flex-col gap-8">
        <div className="flex flex-col gap-3">
          <Label>Roughness</Label>
          <Slider defaultValue={40} aria-label="Roughness" seed="slider-one" />
        </div>
        <div className="flex flex-col gap-3">
          <Label>Price range</Label>
          <Slider defaultValue={[20, 70]} aria-label="Price range" seed="slider-range" />
        </div>
        <div className="flex flex-col gap-3">
          <Label>In steps of 10</Label>
          <Slider defaultValue={50} step={10} aria-label="Steps" seed="slider-steps" />
        </div>
        <div className="flex flex-col gap-3">
          <Label>Disabled</Label>
          <Slider defaultValue={30} disabled aria-label="Disabled" seed="slider-disabled" />
        </div>
      </div>
      <Slider defaultValue={60} orientation="vertical" aria-label="Vertical" seed="slider-vertical" className="h-56 w-auto" />
    </div>
  );
}
