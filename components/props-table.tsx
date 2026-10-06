import type { Prop } from "@/lib/docs";

export function PropsTable({ props }: { props: Prop[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-ink-line text-sm text-ink-3">
            <th className="py-2 pr-4 font-normal">Prop</th>
            <th className="py-2 pr-4 font-normal">Type</th>
            <th className="py-2 font-normal">Default</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-b border-ink-5 align-top">
              <td className="py-3 pr-4 font-bold">{p.name}</td>
              <td className="py-3 pr-4">
                <code className="font-mono text-sm break-words text-ink-2">{p.type}</code>
                <p className="mt-1 text-base text-ink-2">{p.description}</p>
              </td>
              <td className="py-3">
                <code className="font-mono text-sm text-ink-3">{p.default ?? "–"}</code>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
