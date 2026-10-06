import { CopyButton } from "@/components/copy-button";
import { MarginRule } from "@/components/margin-rule";
import { cn } from "@/lib/utils";

/** Code set on the paper like CodeBlock, for code that's built in the browser (no highlighting). */
export function PlainCode({ code, title, className }: { code: string; title?: string; className?: string }) {
  return (
    <figure className={cn("code-block relative pl-6", className)}>
      <MarginRule seed={title ?? "plain"} />
      <figcaption className="flex min-h-8 items-center justify-between gap-4">
        <span className="text-sm text-ink-3">{title}</span>
        <CopyButton text={code} />
      </figcaption>
      <div className="code">
        <pre>
          <code className="text-ink-2">{code}</code>
        </pre>
      </div>
    </figure>
  );
}
