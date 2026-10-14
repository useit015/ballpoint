import { SectionHeading } from "@/registry/ballpoint/ui/section-heading";

export default function SectionHeadingPage() {
  return (
    <header className="flex w-full max-w-md flex-col gap-1">
      <SectionHeading as="h1" underline="swoosh" seed="shp-title" className="text-4xl normal-case tracking-normal italic">
        Field notes
      </SectionHeading>
      <p className="-mt-2 text-lg text-ink-3">Ninety-six pages, mostly about birds.</p>
      <SectionHeading as="h2" underline="wave" seed="shp-sub" delay={500} className="mt-6 text-xl">
        Chapter one
      </SectionHeading>
      <p className="text-ink-2">In which the pen runs out, and a heron does not care.</p>
    </header>
  );
}
