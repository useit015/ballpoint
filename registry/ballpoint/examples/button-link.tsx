import { Button } from "@/registry/ballpoint/ui/button";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

// `render` puts the button's drawing on any element; for a link, say it isn't a <button>.
export default function ButtonLink() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <Button render={<a href="#docs" />} nativeButton={false} seed="bk-docs">
        Read the docs <InkGlyph name="arrow-right" />
      </Button>
      <Button render={<a href="https://github.com/useit015/ballpoint" />} nativeButton={false} variant="outline" seed="bk-github">
        GitHub <InkGlyph name="arrow-up-right" />
      </Button>
      <Button render={<a href="#changelog" />} nativeButton={false} variant="link" seed="bk-changelog">
        What&apos;s new
      </Button>
    </div>
  );
}
