import type { CSSProperties } from "react";
import { ComponentArt } from "@/components/component-art";
import { IntentLink } from "@/components/intent-link";
import { ordered } from "@/lib/nav";

/** One pass of a row: each component's drawing and name. The copy after it is for the loop, so it's hidden from screen readers and the keyboard. */
function Pass({ docs, copy = false }: { docs: typeof ordered; copy?: boolean }) {
  return (
    <ul className="marquee-pass" aria-hidden={copy || undefined}>
      {docs.map((doc) => (
        <li key={doc.name}>
          <IntentLink href={`/docs/${doc.name}`} tabIndex={copy ? -1 : undefined} className="group flex w-32 flex-col items-center gap-2 text-center">
            <ComponentArt name={doc.name} className="h-16 w-24 text-ink-3 transition-colors group-hover:text-ink" />
            <span className="underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-ink-4">{doc.title}</span>
          </IntentLink>
        </li>
      ))}
    </ul>
  );
}

/**
 * Every component, drawn, in two rows sliding past each other; each drawing
 * draws itself in as it slides into view. Pointing at a row, or tabbing into
 * it, holds it still. With reduced motion it's a plain wrapped list.
 */
export function ComponentMarquee() {
  const half = Math.ceil(ordered.length / 2);
  const rows = [ordered.slice(0, half), ordered.slice(half)];
  return (
    <div className="flex flex-col gap-8">
      {rows.map((docs, i) => (
        <div key={i} className="marquee" data-reverse={i % 2 ? "" : undefined} style={{ "--marquee-takes": `${docs.length * 3.2}s` } as CSSProperties}>
          <Pass docs={docs} />
          <Pass docs={docs} copy />
        </div>
      ))}
    </div>
  );
}
