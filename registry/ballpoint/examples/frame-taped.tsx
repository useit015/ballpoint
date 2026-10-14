import { Frame } from "@/registry/ballpoint/ui/frame";

export default function FrameTaped() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-12">
      <Frame caption="Taped, a little askew" tape tilt={-2.5} seed="ft-a">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/doodle-portrait.svg" alt="A doodled portrait" width={140} height={140} className="size-36" />
      </Frame>
      <Frame caption="Dropped the other way" tape tilt={2} gap={10} seed="ft-b">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/doodle-portrait.svg" alt="The same doodle, framed wider" width={110} height={110} className="size-28" />
      </Frame>
    </div>
  );
}
