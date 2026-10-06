import { Frame } from "@/registry/ballpoint/ui/frame";

export default function FrameDemo() {
  return (
    <Frame caption="Drawn on a Tuesday" seed="frame-portrait">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/doodle-portrait.svg" alt="A doodled portrait" width={160} height={160} className="size-40" />
    </Frame>
  );
}
