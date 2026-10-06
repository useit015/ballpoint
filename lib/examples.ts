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
import CardDemo from "@/registry/ballpoint/examples/card-demo";
import BadgeDemo from "@/registry/ballpoint/examples/badge-demo";
import AvatarDemo from "@/registry/ballpoint/examples/avatar-demo";
import KbdDemo from "@/registry/ballpoint/examples/kbd-demo";
import AlertDemo from "@/registry/ballpoint/examples/alert-demo";
import SkeletonDemo from "@/registry/ballpoint/examples/skeleton-demo";
import ProgressDemo from "@/registry/ballpoint/examples/progress-demo";
import TableDemo from "@/registry/ballpoint/examples/table-demo";
import TabsDemo from "@/registry/ballpoint/examples/tabs-demo";
import AccordionDemo from "@/registry/ballpoint/examples/accordion-demo";
import DialogDemo from "@/registry/ballpoint/examples/dialog-demo";
import AlertDialogDemo from "@/registry/ballpoint/examples/alert-dialog-demo";
import SheetDemo from "@/registry/ballpoint/examples/sheet-demo";
import PopoverDemo from "@/registry/ballpoint/examples/popover-demo";
import TooltipDemo from "@/registry/ballpoint/examples/tooltip-demo";
import DropdownMenuDemo from "@/registry/ballpoint/examples/dropdown-menu-demo";
import SelectDemo from "@/registry/ballpoint/examples/select-demo";
import ToastDemo from "@/registry/ballpoint/examples/toast-demo";
import InkIconsDemo from "@/registry/ballpoint/examples/ink-icons-demo";
import AnnotateDemo from "@/registry/ballpoint/examples/annotate-demo";
import AnnotateTypes from "@/registry/ballpoint/examples/annotate-types";
import AnnotateActive from "@/registry/ballpoint/examples/annotate-active";
import SectionHeadingDemo from "@/registry/ballpoint/examples/section-heading-demo";
import PaperDemo from "@/registry/ballpoint/examples/paper-demo";
import FrameDemo from "@/registry/ballpoint/examples/frame-demo";
import CopyButtonDemo from "@/registry/ballpoint/examples/copy-button-demo";

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
  "card-demo": CardDemo,
  "badge-demo": BadgeDemo,
  "avatar-demo": AvatarDemo,
  "kbd-demo": KbdDemo,
  "alert-demo": AlertDemo,
  "skeleton-demo": SkeletonDemo,
  "progress-demo": ProgressDemo,
  "table-demo": TableDemo,
  "tabs-demo": TabsDemo,
  "accordion-demo": AccordionDemo,
  "dialog-demo": DialogDemo,
  "alert-dialog-demo": AlertDialogDemo,
  "sheet-demo": SheetDemo,
  "popover-demo": PopoverDemo,
  "tooltip-demo": TooltipDemo,
  "dropdown-menu-demo": DropdownMenuDemo,
  "select-demo": SelectDemo,
  "toast-demo": ToastDemo,
  "ink-icons-demo": InkIconsDemo,
  "annotate-demo": AnnotateDemo,
  "annotate-types": AnnotateTypes,
  "annotate-active": AnnotateActive,
  "section-heading-demo": SectionHeadingDemo,
  "paper-demo": PaperDemo,
  "frame-demo": FrameDemo,
  "copy-button-demo": CopyButtonDemo,
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
