import { Button } from "@/registry/ballpoint/ui/button";

export default function ButtonActions() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <Button variant="ghost" seed="ba-cancel">
          Cancel
        </Button>
        <Button variant="outline" seed="ba-draft">
          Save draft
        </Button>
        <Button seed="ba-publish">Publish</Button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-ink-2">Delete this notebook for good?</p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" seed="ba-keep">
            Keep it
          </Button>
          <Button variant="destructive" size="sm" seed="ba-delete">
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
