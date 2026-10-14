import { Button } from "@/registry/ballpoint/ui/button";
import { InkThemeToggle } from "@/registry/ballpoint/ui/ink-theme-toggle";

export default function InkThemeToggleHeader() {
  return (
    <header className="flex w-full max-w-lg items-center justify-between gap-6 border-b border-ink-4 pb-3">
      <span className="text-xl font-bold">Field notes</span>
      <nav aria-label="Main" className="flex items-center gap-1">
        <Button variant="ghost" size="sm" seed="ith-docs">
          Pages
        </Button>
        <Button variant="ghost" size="sm" seed="ith-about">
          About
        </Button>
        <InkThemeToggle variant="ghost" size="icon-sm" seed="ith-toggle" />
      </nav>
    </header>
  );
}
