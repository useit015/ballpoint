import { highlight } from "@/lib/highlight";
import { CopyButton } from "@/components/copy-button";
import { cn } from "@/lib/utils";

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
    <figure className={cn("code-block relative", className)}>
      {title && <figcaption className="border-b border-ink-5 px-4 py-2 text-sm text-ink-3">{title}</figcaption>}
      <div className="relative">
        <div dangerouslySetInnerHTML={{ __html: html }} />
        <CopyButton text={code} className="absolute top-2 right-2" />
      </div>
    </figure>
  );
}
