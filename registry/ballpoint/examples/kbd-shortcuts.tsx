import { Kbd, KbdGroup } from "@/registry/ballpoint/ui/kbd";

const shortcuts = [
  ["Search the docs", ["/"]],
  ["Open the command palette", ["Ctrl", "K"]],
  ["Close a dialog", ["Esc"]],
  ["Move between tabs", ["←", "→"]],
] as const;

export default function KbdShortcuts() {
  return (
    <dl className="flex w-full max-w-sm flex-col gap-4">
      {shortcuts.map(([what, keys]) => (
        <div key={what} className="flex items-center justify-between gap-4">
          <dt className="text-ink-2">{what}</dt>
          <dd>
            <KbdGroup>
              {keys.map((key) => (
                <Kbd key={key} seed={`ks-${what}-${key}`}>
                  {key}
                </Kbd>
              ))}
            </KbdGroup>
          </dd>
        </div>
      ))}
    </dl>
  );
}
