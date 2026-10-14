import { SectionHeading } from "@/registry/ballpoint/ui/section-heading";

const shapes = ["swoosh", "double", "wave", "zigzag", "loop", "flick"] as const;

export default function SectionHeadingUnderlines() {
  return (
    <ul className="grid w-full max-w-xl gap-x-10 gap-y-6 sm:grid-cols-2">
      {shapes.map((shape, i) => (
        <li key={shape}>
          <SectionHeading underline={shape} seed={`shu-${shape}`} delay={i * 150} className="text-xl">
            {shape}
          </SectionHeading>
        </li>
      ))}
    </ul>
  );
}
