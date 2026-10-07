import { highlight } from "@/lib/highlight";
import { CodeFrame } from "@/components/code-frame";
import { CopyButton } from "@/components/copy-button";

/** Highlighted code on a slip of paper, with its file name (or language) and a copy button. */
export async function CodeBlock({
  code,
  lang = "tsx",
  title,
  className,
}: {
  code: string;
  lang?: "tsx" | "bash" | "css" | "json";
  title?: string;
  className?: string;
}) {
  const html = await highlight(code, lang);
  return (
    <CodeFrame
      className={className}
      seed={`${title ?? lang}-${code.length}-${code.slice(0, 40)}`}
      header={
        <>
          <span className="truncate text-sm text-ink-3">{title ?? lang}</span>
          <CopyButton text={code} />
        </>
      }
    >
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </CodeFrame>
  );
}
