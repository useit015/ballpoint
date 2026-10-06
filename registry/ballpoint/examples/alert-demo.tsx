import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/registry/ballpoint/ui/alert";
import { Button } from "@/registry/ballpoint/ui/button";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

export default function AlertDemo() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <Alert seed="alert-note">
        <InkGlyph name="info-circle" />
        <AlertTitle>The ink is still wet</AlertTitle>
        <AlertDescription>Changes save as you type; give it a second before closing the tab.</AlertDescription>
      </Alert>
      <Alert variant="destructive" seed="alert-error">
        <InkGlyph name="alert-circle" />
        <AlertTitle>The page couldn&apos;t be saved</AlertTitle>
        <AlertDescription>The connection dropped halfway. Nothing was lost; try again.</AlertDescription>
        <AlertAction>
          <Button size="xs" variant="destructive" seed="alert-retry">
            Retry
          </Button>
        </AlertAction>
      </Alert>
    </div>
  );
}
