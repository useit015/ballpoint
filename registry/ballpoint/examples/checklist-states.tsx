import { Checklist, ChecklistItem } from "@/registry/ballpoint/ui/checklist";

export default function ChecklistStates() {
  return (
    <Checklist defaultValue={["sketch", "lock"]} aria-label="Release steps">
      <ChecklistItem value="sketch" seed="cs-sketch">
        Sketch the layout
      </ChecklistItem>
      <ChecklistItem value="draw" seed="cs-draw">
        Draw the final version
      </ChecklistItem>
      <ChecklistItem value="lock" disabled seed="cs-lock">
        Lock the registry (done by CI)
      </ChecklistItem>
      <ChecklistItem value="publish" disabled seed="cs-publish">
        Publish (waits for the lock)
      </ChecklistItem>
    </Checklist>
  );
}
