import { highlight } from "@/lib/highlight";
import { CodeFold } from "@/components/code-fold";
import { CodeFrame } from "@/components/code-frame";
import { CopyButton } from "@/components/copy-button";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";

/** Past this many lines a listing is folded. */
const FOLD_AT = 24;

/**
 * Highlighted code on a slip of paper: the file it belongs to (or its
 * language) on the left, a copy button on the right, line numbers in the
 * margin, and a long listing folded.
 */
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
  const lines = code.trimEnd().split("\n").length;
  const body = <div dangerouslySetInnerHTML={{ __html: html }} />;
  return (
    <CodeFrame
      className={className}
      numbers={lines > 4}
      header={
        <>
          <span className="code-title">
            {title && <InkIcon name="file-text" className="size-4" />}
            <span className="truncate">{title ?? <span className="code-lang">{lang}</span>}</span>
          </span>
          <span className="flex items-center gap-1">
            {title && <span className="code-lang max-sm:hidden">{lang}</span>}
            <CopyButton text={code} />
          </span>
        </>
      }
    >
      {lines > FOLD_AT ? <CodeFold lines={lines}>{body}</CodeFold> : body}
    </CodeFrame>
  );
}
