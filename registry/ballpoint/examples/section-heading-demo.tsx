import { SectionHeading } from "@/registry/ballpoint/ui/section-heading";

export default function SectionHeadingDemo() {
  return (
    <section aria-labelledby="sh-projects" className="flex w-full max-w-md flex-col gap-4">
      <SectionHeading id="sh-projects" specks seed="section-heading-projects">
        Projects
      </SectionHeading>
      <p className="text-ink-2">A component library drawn in blue ballpoint, a fighting game in the browser, and a model picker for the command line.</p>
    </section>
  );
}
