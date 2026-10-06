import { Button } from "@/registry/ballpoint/ui/button";
import { InkProvider } from "@/registry/ballpoint/hooks/use-ink-box";

export default function ButtonPens() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-center gap-5">
        <Button radius={10} seed="pen-rounded">
          Rounded
        </Button>
        <Button variant="outline" radius="full" seed="pen-pill">
          Pill
        </Button>
        <Button variant="secondary" radius={10} seed="pen-rounded-2">
          Rounded hatch
        </Button>
        <Button variant="outline" corners="joined" passes={2} seed="pen-joined">
          Joined corners
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <Button roughness={0} passes={1} seed="pen-neat">
          Ruler-neat
        </Button>
        <Button roughness={2} seed="pen-scrawl">
          Scrawled
        </Button>
        <Button variant="outline" weight={1.8} seed="pen-heavy">
          Heavy pen
        </Button>
        <Button variant="outline" shadow="solid" seed="pen-solid-shadow">
          Solid shadow
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-5">
        <Button fill="hatch" seed="pen-fill-hatch">
          Cross-hatched
        </Button>
        <Button fill="scribble" seed="pen-fill-scribble">
          Scribbled
        </Button>
        <Button fill="flat" seed="pen-fill-flat">
          Flat ink
        </Button>
        <Button variant="secondary" fill="flat" seed="pen-fill-wash">
          Wash
        </Button>
      </div>
      {/* Pen settings apply to everything inside a provider. */}
      <InkProvider radius="full" roughness={1.4} shadow="none">
        <div className="flex flex-wrap items-center gap-5">
          <Button seed="pen-group-1">Save</Button>
          <Button variant="outline" seed="pen-group-2">
            Cancel
          </Button>
          <Button variant="destructive" seed="pen-group-3">
            Delete
          </Button>
        </div>
      </InkProvider>
    </div>
  );
}
