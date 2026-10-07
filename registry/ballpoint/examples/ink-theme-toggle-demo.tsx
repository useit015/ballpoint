import { InkThemeToggle } from "@/registry/ballpoint/ui/ink-theme-toggle";

export default function InkThemeToggleDemo() {
  return (
    <div className="flex flex-col items-center gap-3">
      <InkThemeToggle seed="theme-toggle-demo" />
      <p className="text-sm text-ink-3">Night spreads from the button like a drop of ink.</p>
    </div>
  );
}
