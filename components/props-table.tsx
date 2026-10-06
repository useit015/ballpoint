import type { Prop } from "@/lib/docs";
import { inkRules } from "@/registry/ballpoint/lib/ink";

const code = "font-mono text-[0.8125rem] leading-relaxed [font-variation-settings:'MONO'_1,'CASL'_1]";

// Each prop is ruled off underneath by hand, like the library's own tables.
const rule =
  "relative py-4 after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-[2.5px] after:h-[5px] after:bg-ink-4 after:[mask-image:var(--ink-rule-1)] after:[mask-size:100%_100%] after:[mask-repeat:no-repeat] nth-[3n+2]:after:[mask-image:var(--ink-rule-2)] nth-[3n]:after:[mask-image:var(--ink-rule-3)] last:after:hidden";

/**
 * Props as a ruled list: the name and its type on one line, the default on
 * the right, what it does underneath. Reads the same on a phone.
 */
export function PropsTable({ props }: { props: Prop[] }) {
  return (
    <dl className="flex flex-col" style={inkRules}>
      {props.map((p) => (
        <div key={p.name} className={rule}>
          <dt className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <span className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-bold">{p.name}</span>
              <code className={`${code} text-ink-2`}>{p.type}</code>
            </span>
            {p.default && (
              <span className="text-sm text-ink-3">
                default <code className={`${code} text-ink-2`}>{p.default}</code>
              </span>
            )}
          </dt>
          <dd className="mt-1.5 text-ink-2">{p.description}</dd>
        </div>
      ))}
    </dl>
  );
}
