import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { ComponentType } from "react";
import ButtonDemo from "@/registry/ballpoint/examples/button-demo";
import ButtonPens from "@/registry/ballpoint/examples/button-pens";
import InputDemo from "@/registry/ballpoint/examples/input-demo";
import TextareaDemo from "@/registry/ballpoint/examples/textarea-demo";
import LabelDemo from "@/registry/ballpoint/examples/label-demo";
import SeparatorDemo from "@/registry/ballpoint/examples/separator-demo";
import FieldDemo from "@/registry/ballpoint/examples/field-demo";
import CheckboxDemo from "@/registry/ballpoint/examples/checkbox-demo";
import RadioGroupDemo from "@/registry/ballpoint/examples/radio-group-demo";
import SwitchDemo from "@/registry/ballpoint/examples/switch-demo";
import SliderDemo from "@/registry/ballpoint/examples/slider-demo";

export const examples: Record<string, ComponentType> = {
  "button-demo": ButtonDemo,
  "button-pens": ButtonPens,
  "input-demo": InputDemo,
  "textarea-demo": TextareaDemo,
  "label-demo": LabelDemo,
  "separator-demo": SeparatorDemo,
  "field-demo": FieldDemo,
  "checkbox-demo": CheckboxDemo,
  "radio-group-demo": RadioGroupDemo,
  "switch-demo": SwitchDemo,
  "slider-demo": SliderDemo,
};

/** An example's source, with registry imports written the way they land in an app. */
export function exampleSource(name: string) {
  return readFileSync(join(process.cwd(), "registry/ballpoint/examples", `${name}.tsx`), "utf8")
    .replaceAll("@/registry/ballpoint/ui/", "@/components/ui/")
    .replaceAll("@/registry/ballpoint/lib/", "@/lib/")
    .replaceAll("@/registry/ballpoint/hooks/", "@/hooks/");
}

/** A registry item's own source, as `shadcn add` would write it. */
export function itemSource(path: string) {
  // Scoped to registry/ so the build only traces that folder.
  return readFileSync(join(process.cwd(), "registry", path.replace(/^registry\//, "")), "utf8")
    .replaceAll("@/registry/ballpoint/ui/", "@/components/ui/")
    .replaceAll("@/registry/ballpoint/lib/", "@/lib/")
    .replaceAll("@/registry/ballpoint/hooks/", "@/hooks/");
}
