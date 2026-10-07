import { CopyButton } from "@/registry/ballpoint/ui/copy-button";

export default function CopyButtonStates() {
  return (
    <div className="flex flex-wrap items-center gap-5">
      <CopyButton value="ballpoint.st9wd.com" variant="default" seed="cbs-default">
        Copy URL
      </CopyButton>
      <CopyButton value="ballpoint.st9wd.com" variant="outline" size="sm" copiedLabel="Got it" seed="cbs-sm">
        Copy, small
      </CopyButton>
      <CopyButton value="ballpoint.st9wd.com" variant="ghost" seed="cbs-ghost">
        Ghost
      </CopyButton>
      <CopyButton value="ballpoint.st9wd.com" size="icon" seed="cbs-icon">
        Copy URL
      </CopyButton>
    </div>
  );
}
