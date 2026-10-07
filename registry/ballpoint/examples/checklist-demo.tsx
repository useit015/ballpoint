import { Checklist, ChecklistItem } from "@/registry/ballpoint/ui/checklist";

export default function ChecklistDemo() {
  return (
    <Checklist defaultValue={["pens"]} aria-label="Before the launch">
      <ChecklistItem value="pens" seed="checklist-pens">
        Buy more blue pens
      </ChecklistItem>
      <ChecklistItem value="docs" seed="checklist-docs">
        Write the docs
      </ChecklistItem>
      <ChecklistItem value="ship" seed="checklist-ship">
        Ship it
      </ChecklistItem>
    </Checklist>
  );
}
