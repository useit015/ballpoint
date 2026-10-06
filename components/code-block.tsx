import { highlight } from "@/lib/highlight";
import { CopyButton } from "@/components/copy-button";
import { MarginRule } from "@/components/margin-rule";
import { cn } from "@/lib/utils";

/**
 * Code set on the page itself, not in a box: a pen-drawn margin rule down
 * the left, the file name and a copy action above.
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
  return (
    <figure className={cn("code-block relative pl-6", className)}>
      <MarginRule seed={title ?? code.slice(0, 40)} />
      {title ? (
        <figcaption className="flex min-h-8 items-center justify-between gap-4">
          <span className="text-sm text-ink-3">{title}</span>
          <CopyButton text={code} />
        </figcaption>
      ) : (
        // No caption row to hang it on: copy sits in the corner, with room kept clear for it.
        <CopyButton text={code} className="absolute top-0 right-0" />
      )}
      <div className={cn("code", !title && "pr-16")} dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
