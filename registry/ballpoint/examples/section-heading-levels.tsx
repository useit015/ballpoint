import { SectionHeading } from "@/registry/ballpoint/ui/section-heading";

export default function SectionHeadingLevels() {
  return (
    <div className="flex w-full max-w-md flex-col gap-10">
      <SectionHeading as="h2" seed="shl-large" className="text-4xl">
        Notebook
      </SectionHeading>
      <SectionHeading as="h3" seed="shl-default">
        Chapter one
      </SectionHeading>
      <SectionHeading as="h4" seed="shl-small" className="text-base">
        A smaller aside
      </SectionHeading>
      <SectionHeading as="h3" seed="shl-delayed" delay={600} specks>
        Written a beat later
      </SectionHeading>
    </div>
  );
}
