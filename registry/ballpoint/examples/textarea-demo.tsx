import { Label } from "@/registry/ballpoint/ui/label";
import { Textarea } from "@/registry/ballpoint/ui/textarea";

export default function TextareaDemo() {
  return (
    <div className="grid w-full max-w-lg gap-6">
      <div className="grid gap-2">
        <Label htmlFor="textarea-message">Message</Label>
        <Textarea id="textarea-message" placeholder="It grows as you write." seed="textarea-message" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="textarea-notes">Notes, on ruled lines</Label>
        <Textarea id="textarea-notes" variant="lined" rows={4} defaultValue={"Buy ink.\nCall the printer about the cream stock."} seed="textarea-notes" />
      </div>
    </div>
  );
}
