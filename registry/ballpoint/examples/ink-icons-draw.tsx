import { InkIcon, type IconName } from "@/registry/ballpoint/ui/ink-icons";

const icons: IconName[] = ["pen", "heart", "star", "bell", "mail", "coffee"];

export default function InkIconsDraw() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <span className="text-ink-3">draw=&quot;mount&quot;: written as they appear. Press Redraw to see it again.</span>
        <ul className="flex gap-6">
          {icons.map((name, i) => (
            <li key={name}>
              <InkIcon name={name} draw="mount" duration={380 + i * 40} className="size-9 text-ink" />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3">
        <span className="text-ink-3">draw=&quot;hover&quot;: drawn in while the pointer is over the button.</span>
        <ul className="flex gap-3">
          {icons.map((name) => (
            <li key={name}>
              <button type="button" aria-label={name} className="group/draw grid size-12 cursor-pointer place-items-center rounded-md text-ink-2 transition-colors hover:text-ink">
                <InkIcon name={name} draw="hover" className="size-7" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
