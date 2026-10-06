import { CopyButton } from "@/registry/ballpoint/ui/copy-button";

export default function CopyButtonDemo() {
  return (
    <div className="flex flex-col items-center gap-6">
      <CopyButton value="hello@example.com" seed="copy-email">
        Copy email
      </CopyButton>
      <div className="flex items-center gap-2 font-mono text-sm text-ink-2">
        <code>npx shadcn@latest add @ballpoint/copy-button</code>
        <CopyButton value="npx shadcn@latest add @ballpoint/copy-button" variant="ghost" size="icon-sm" seed="copy-command">
          Copy command
        </CopyButton>
      </div>
    </div>
  );
}
