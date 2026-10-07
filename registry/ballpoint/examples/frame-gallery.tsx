import { Frame } from "@/registry/ballpoint/ui/frame";

export default function FrameGallery() {
  return (
    <div className="flex flex-wrap items-start justify-center gap-10">
      {[
        ["One pass", 1, "frame-one"],
        ["Two passes", 2, "frame-two"],
        ["Three passes", 3, "frame-three"],
      ].map(([caption, passes, seed]) => (
        <Frame key={seed as string} caption={caption as string} passes={passes as 1 | 2 | 3} seed={seed as string}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/doodle-portrait.svg" alt="A doodled portrait" width={112} height={112} className="size-28" />
        </Frame>
      ))}
    </div>
  );
}
