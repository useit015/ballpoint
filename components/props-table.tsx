import type { Prop } from "@/lib/docs";
import { ruledItem } from "@/components/rule";
import { inkRules } from "@/registry/ballpoint/lib/ink";

/**
 * Props as a ruled list: the name (and its default) in the margin, the type
 * and what it does beside it. Stacks the same way on a phone.
 */
export function PropsTable({ props }: { props: Prop[] }) {
  return (
    <dl className="flex flex-col" style={inkRules}>
      {props.map((p) => (
        <div key={p.name} className={`${ruledItem} props-row`}>
          <dt>
            <div className="props-name">{p.name}</div>
            {p.default && (
              <div className="props-default">
                default <code>{p.default}</code>
              </div>
            )}
          </dt>
          <dd>
            <code className="props-type">{p.type}</code>
            <p className="props-desc">{p.description}</p>
          </dd>
        </div>
      ))}
    </dl>
  );
}
