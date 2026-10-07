import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/registry/ballpoint/ui/alert";
import { Button } from "@/registry/ballpoint/ui/button";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

export default function AlertSimple() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-6">
      <Alert seed="as-title">
        <AlertTitle>Title only, no icon</AlertTitle>
      </Alert>
      <Alert seed="as-description">
        <AlertDescription>A plain note: a single line of text boxed off from the page.</AlertDescription>
      </Alert>
      <Alert seed="as-action">
        <InkGlyph name="info-circle" />
        <AlertTitle>A new refill is ready</AlertTitle>
        <AlertDescription>Swap it in before your next long session.</AlertDescription>
        <AlertAction>
          <Button size="xs" variant="outline" seed="as-action-btn">
            Order
          </Button>
        </AlertAction>
      </Alert>
    </div>
  );
}
