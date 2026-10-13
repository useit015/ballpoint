import { SectionHeading } from "@/registry/ballpoint/ui/section-heading";
import { Customize } from "@/components/home/customize";
import { TornSheet } from "@/components/home/torn-sheet";
import { TextLink } from "@/components/text-link";

/** "Customize your style": pick a pen and a paper and see the same page in them, by day and by night. */
export function CustomizeSection() {
  return (
    <TornSheet aria-labelledby="customize" edge="b" className="home-sheet home-customize" style={{ "--tilt": "0.2deg" } as React.CSSProperties}>
      <header className="home-head">
        <SectionHeading id="customize" underline="loop" seed="home-customize" className="home-h2">
          Customize your style
        </SectionHeading>
        <p className="home-sub">
          Four pens and three papers, each with a night side. <TextLink href="/customize">Open the full customizer</TextLink>.
        </p>
      </header>
      <Customize />
    </TornSheet>
  );
}
