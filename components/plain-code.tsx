import { CodeFrame } from "@/components/code-frame";
import { CopyButton } from "@/components/copy-button";

/** Code built in the browser (so not highlighted), on the same slip as CodeBlock. */
export function PlainCode({ code, title, className }: { code: string; title?: string; className?: string }) {
  return (
    <CodeFrame
      seed={title ?? "plain"}
      className={className}
      header={
        <>
          <span className="truncate text-sm text-ink-3">{title}</span>
          <CopyButton text={code} />
        </>
      }
    >
      <pre>
        <code style={{ color: "var(--code-plain)" }}>{code}</code>
      </pre>
    </CodeFrame>
  );
}
