import { Button } from "@/registry/ballpoint/ui/button";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

export default function ButtonDemo() {
  return (
    <div className="flex flex-col gap-9">
      <div className="flex flex-wrap items-center gap-5">
        <Button seed="v-default">
          Book a call <InkGlyph name="arrow-up-right" />
        </Button>
        <Button variant="outline" seed="v-outline">
          Outline
        </Button>
        <Button variant="secondary" seed="v-secondary">
          Secondary
        </Button>
        <Button variant="destructive" seed="v-destructive">
          Destructive
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <Button variant="ghost" seed="v-ghost">
          Ghost
        </Button>
        <Button variant="link" seed="v-link">
          Link
        </Button>
        <Button size="icon" variant="outline" seed="i-outline" aria-label="Add a page">
          <InkGlyph name="plus" />
        </Button>
        <Button size="icon" variant="ghost" seed="i-ghost" aria-label="Next page">
          <InkGlyph name="arrow-right" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <Button size="xs" variant="outline" seed="s-xs">
          Extra small
        </Button>
        <Button size="sm" variant="outline" seed="s-sm">
          Small
        </Button>
        <Button variant="outline" seed="s-default">
          Default
        </Button>
        <Button size="lg" variant="outline" seed="s-lg">
          Large
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <Button draw="mount" seed="mount">
          Draws itself in
        </Button>
        <Button variant="outline" seed="disabled" disabled>
          Disabled
        </Button>
      </div>
    </div>
  );
}
