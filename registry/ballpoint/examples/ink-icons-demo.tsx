import { InkIcon, iconNames } from "@/registry/ballpoint/ui/ink-icons";

export default function InkIconsDemo() {
  return (
    <ul className="grid w-full max-w-2xl grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-x-2 gap-y-6">
      {iconNames.map((name) => (
        <li key={name} className="flex flex-col items-center gap-2 text-center">
          <InkIcon name={name} draw="mount" className="size-6" />
          <span className="text-xs text-ink-3">{name}</span>
        </li>
      ))}
    </ul>
  );
}
