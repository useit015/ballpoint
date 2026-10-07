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
import SignaturePadDemo from "@/registry/ballpoint/examples/signature-pad-demo";
import HatchGridDemo from "@/registry/ballpoint/examples/hatch-grid-demo";
import TimelineDemo from "@/registry/ballpoint/examples/timeline-demo";
import TimelineVertical from "@/registry/ballpoint/examples/timeline-vertical";
import InkThemeToggleDemo from "@/registry/ballpoint/examples/ink-theme-toggle-demo";
import MarginNoteDemo from "@/registry/ballpoint/examples/margin-note-demo";
import ChecklistDemo from "@/registry/ballpoint/examples/checklist-demo";
import RedactDemo from "@/registry/ballpoint/examples/redact-demo";
import ScrawlDemo from "@/registry/ballpoint/examples/scrawl-demo";

import ButtonIcons from "@/registry/ballpoint/examples/button-icons";
import ButtonLoading from "@/registry/ballpoint/examples/button-loading";
import ButtonLink from "@/registry/ballpoint/examples/button-link";
import ButtonActions from "@/registry/ballpoint/examples/button-actions";
import InputTypes from "@/registry/ballpoint/examples/input-types";
import InputStates from "@/registry/ballpoint/examples/input-states";
import InputWithButton from "@/registry/ballpoint/examples/input-with-button";
import TextareaCounter from "@/registry/ballpoint/examples/textarea-counter";
import TextareaStates from "@/registry/ballpoint/examples/textarea-states";
import TextareaWithButton from "@/registry/ballpoint/examples/textarea-with-button";
import LabelControls from "@/registry/ballpoint/examples/label-controls";
import FieldSettings from "@/registry/ballpoint/examples/field-settings";
import FieldErrors from "@/registry/ballpoint/examples/field-errors";
import CheckboxStates from "@/registry/ballpoint/examples/checkbox-states";
import CheckboxCards from "@/registry/ballpoint/examples/checkbox-cards";
import RadioGroupStates from "@/registry/ballpoint/examples/radio-group-states";
import SwitchSettings from "@/registry/ballpoint/examples/switch-settings";
import SliderControlled from "@/registry/ballpoint/examples/slider-controlled";

import CardForm from "@/registry/ballpoint/examples/card-form";
import CardStats from "@/registry/ballpoint/examples/card-stats";
import BadgeIcons from "@/registry/ballpoint/examples/badge-icons";
import BadgeStatus from "@/registry/ballpoint/examples/badge-status";
import SeparatorSections from "@/registry/ballpoint/examples/separator-sections";
import AvatarList from "@/registry/ballpoint/examples/avatar-list";
import KbdShortcuts from "@/registry/ballpoint/examples/kbd-shortcuts";
import KbdInButton from "@/registry/ballpoint/examples/kbd-in-button";
import AlertSimple from "@/registry/ballpoint/examples/alert-simple";
import SkeletonCard from "@/registry/ballpoint/examples/skeleton-card";
import ProgressControlled from "@/registry/ballpoint/examples/progress-controlled";
import TableSelectable from "@/registry/ballpoint/examples/table-selectable";
import TabsVertical from "@/registry/ballpoint/examples/tabs-vertical";
import TabsIcons from "@/registry/ballpoint/examples/tabs-icons";
import AccordionMultiple from "@/registry/ballpoint/examples/accordion-multiple";

import DialogControlled from "@/registry/ballpoint/examples/dialog-controlled";
import DialogScroll from "@/registry/ballpoint/examples/dialog-scroll";
import AlertDialogConfirm from "@/registry/ballpoint/examples/alert-dialog-confirm";
import SheetNav from "@/registry/ballpoint/examples/sheet-nav";
import PopoverActions from "@/registry/ballpoint/examples/popover-actions";
import TooltipSides from "@/registry/ballpoint/examples/tooltip-sides";
import TooltipShortcut from "@/registry/ballpoint/examples/tooltip-shortcut";
import DropdownMenuRowActions from "@/registry/ballpoint/examples/dropdown-menu-row-actions";
import SelectForm from "@/registry/ballpoint/examples/select-form";
import SelectControlled from "@/registry/ballpoint/examples/select-controlled";
import ToastActions from "@/registry/ballpoint/examples/toast-actions";

import AnnotateReview from "@/registry/ballpoint/examples/annotate-review";
import SectionHeadingLevels from "@/registry/ballpoint/examples/section-heading-levels";
import PaperLetter from "@/registry/ballpoint/examples/paper-letter";
import PaperTextures from "@/registry/ballpoint/examples/paper-textures";
import FrameGallery from "@/registry/ballpoint/examples/frame-gallery";
import CopyButtonStates from "@/registry/ballpoint/examples/copy-button-states";
import CopyButtonDynamic from "@/registry/ballpoint/examples/copy-button-dynamic";
import InkIconsButtons from "@/registry/ballpoint/examples/ink-icons-buttons";
import InkIconsSizes from "@/registry/ballpoint/examples/ink-icons-sizes";

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
  "button-icons": ButtonIcons,
  "button-loading": ButtonLoading,
  "button-link": ButtonLink,
  "button-actions": ButtonActions,
  "input-types": InputTypes,
  "input-states": InputStates,
  "input-with-button": InputWithButton,
  "textarea-counter": TextareaCounter,
  "textarea-states": TextareaStates,
  "textarea-with-button": TextareaWithButton,
  "label-controls": LabelControls,
  "field-settings": FieldSettings,
  "field-errors": FieldErrors,
  "checkbox-states": CheckboxStates,
  "checkbox-cards": CheckboxCards,
  "radio-group-states": RadioGroupStates,
  "switch-settings": SwitchSettings,
  "slider-controlled": SliderControlled,
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
  "card-form": CardForm,
  "card-stats": CardStats,
  "badge-icons": BadgeIcons,
  "badge-status": BadgeStatus,
  "separator-sections": SeparatorSections,
  "avatar-list": AvatarList,
  "kbd-shortcuts": KbdShortcuts,
  "kbd-in-button": KbdInButton,
  "alert-simple": AlertSimple,
  "skeleton-card": SkeletonCard,
  "progress-controlled": ProgressControlled,
  "table-selectable": TableSelectable,
  "tabs-vertical": TabsVertical,
  "tabs-icons": TabsIcons,
  "accordion-multiple": AccordionMultiple,
  "dialog-demo": DialogDemo,
  "alert-dialog-demo": AlertDialogDemo,
  "sheet-demo": SheetDemo,
  "popover-demo": PopoverDemo,
  "tooltip-demo": TooltipDemo,
  "dropdown-menu-demo": DropdownMenuDemo,
  "select-demo": SelectDemo,
  "toast-demo": ToastDemo,
  "dialog-controlled": DialogControlled,
  "dialog-scroll": DialogScroll,
  "alert-dialog-confirm": AlertDialogConfirm,
  "sheet-nav": SheetNav,
  "popover-actions": PopoverActions,
  "tooltip-sides": TooltipSides,
  "tooltip-shortcut": TooltipShortcut,
  "dropdown-menu-row-actions": DropdownMenuRowActions,
  "select-form": SelectForm,
  "select-controlled": SelectControlled,
  "toast-actions": ToastActions,
  "ink-icons-demo": InkIconsDemo,
  "annotate-demo": AnnotateDemo,
  "annotate-types": AnnotateTypes,
  "annotate-active": AnnotateActive,
  "section-heading-demo": SectionHeadingDemo,
  "paper-demo": PaperDemo,
  "frame-demo": FrameDemo,
  "copy-button-demo": CopyButtonDemo,
  "annotate-review": AnnotateReview,
  "section-heading-levels": SectionHeadingLevels,
  "paper-letter": PaperLetter,
  "paper-textures": PaperTextures,
  "frame-gallery": FrameGallery,
  "copy-button-states": CopyButtonStates,
  "copy-button-dynamic": CopyButtonDynamic,
  "ink-icons-buttons": InkIconsButtons,
  "ink-icons-sizes": InkIconsSizes,
  "signature-pad-demo": SignaturePadDemo,
  "hatch-grid-demo": HatchGridDemo,
  "timeline-demo": TimelineDemo,
  "timeline-vertical": TimelineVertical,
  "ink-theme-toggle-demo": InkThemeToggleDemo,
  "margin-note-demo": MarginNoteDemo,
  "checklist-demo": ChecklistDemo,
  "redact-demo": RedactDemo,
  "scrawl-demo": ScrawlDemo,
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
