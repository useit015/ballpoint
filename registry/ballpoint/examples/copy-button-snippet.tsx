import { CopyButton } from "@/registry/ballpoint/ui/copy-button";

const command = "pnpm dlx shadcn@latest add @ballpoint/card";

export default function CopyButtonSnippet() {
  return (
    <div className="flex w-full max-w-lg items-center justify-between gap-4 rounded-md border border-ink-4 px-4 py-3">
      <code className="min-w-0 font-mono text-sm break-all text-ink-2">
        <span className="text-ink-3 select-none">$ </span>
        {command}
      </code>
      <CopyButton value={command} variant="ghost" size="icon-sm" seed="cbs-copy">
        Copy command
      </CopyButton>
    </div>
  );
}
