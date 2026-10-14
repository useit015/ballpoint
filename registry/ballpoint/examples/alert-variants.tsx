import { Alert, AlertDescription, AlertTitle } from "@/registry/ballpoint/ui/alert";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

export default function AlertVariants() {
  return (
    <div className="grid w-full max-w-xl gap-6">
      <Alert seed="av-default">
        <InkGlyph name="info-circle" />
        <AlertTitle>Default</AlertTitle>
        <AlertDescription>Pencilled around the note, for anything worth a second look.</AlertDescription>
      </Alert>
      <Alert variant="note" seed="av-note">
        <InkGlyph name="info-circle" />
        <AlertTitle>Note</AlertTitle>
        <AlertDescription>Hatched lightly across, as if it had been highlighted in the margin.</AlertDescription>
      </Alert>
      <Alert variant="destructive" seed="av-destructive">
        <InkGlyph name="alert-circle" />
        <AlertTitle>Destructive</AlertTitle>
        <AlertDescription>In red pen. The notebook will be deleted for good.</AlertDescription>
      </Alert>
    </div>
  );
}
