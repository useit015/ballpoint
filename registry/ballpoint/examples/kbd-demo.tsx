import { Kbd, KbdGroup } from "@/registry/ballpoint/ui/kbd";

export default function KbdDemo() {
  return (
    <div className="flex flex-col gap-5">
      <KbdGroup>
        <Kbd seed="kbd-cmd">⌘</Kbd>
        <Kbd seed="kbd-k">K</Kbd>
      </KbdGroup>
      <p className="text-ink-2">
        Press{" "}
        <KbdGroup>
          <Kbd seed="kbd-ctrl">Ctrl</Kbd>
          <span>+</span>
          <Kbd seed="kbd-shift">Shift</Kbd>
          <span>+</span>
          <Kbd seed="kbd-p">P</Kbd>
        </KbdGroup>{" "}
        to open the command palette.
      </p>
    </div>
  );
}
