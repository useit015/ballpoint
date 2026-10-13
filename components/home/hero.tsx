import Link from "next/link";
import { Annotate } from "@/registry/ballpoint/ui/annotate";
import { Button } from "@/registry/ballpoint/ui/button";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";
import { Scrawl } from "@/registry/ballpoint/ui/scrawl";
import { PenArt } from "@/components/art/pen-art";
import { Callout } from "@/components/home/callout";
import { HeroLake, HeroSky, HeroTrees } from "@/components/home/hero-life";
import { StickyNote } from "@/components/home/sticky-note";
import { written } from "@/components/home/write";
import { heroScene } from "@/lib/art/hero";

const scene = heroScene();

export function Hero() {
  return (
    <section aria-labelledby="hero" data-parallax-host className="home-hero">
      <div className="home-hero-copy">
        <h1 id="hero" className="home-title">
          <span className="block">{written("An interface", 150)}</span>{" "}
          <span className="block">
            {written("you can", 650)}{" "}
            <Annotate type="underline" draw="mount" delay={1250} seed="hero-write" className="home-write">
              {written("write on", 1000)}
            </Annotate>
            <span className="home-stop">
              .<Scrawl kind="slash" seed="hero-ticks" draw="mount" delay={1700} scale={0.8} rotate={-28} className="home-ticks" />
            </span>
          </span>
        </h1>
        <p className="home-lede">
          The components you know from shadcn/ui, built on Base&nbsp;UI and drawn with a ballpoint.
        </p>
        <div className="home-actions">
          <Button render={<Link href="/docs" />} nativeButton={false} size="lg" seed="hero-start" draw="mount">
            Get started <InkGlyph name="arrow-right" />
          </Button>
          <Button render={<Link href="/components" />} nativeButton={false} variant="outline" size="lg" seed="hero-browse" draw="mount">
            Browse components
          </Button>
        </div>
        <p className="hero-hint">
          <InkIcon name="pen" className="size-5 shrink-0" />
          <span>Go on, poke the picture.</span>
        </p>
      </div>

      <div className="home-hero-art">
        <Callout lines={["Same components.", "More human."]} target="hero-art" at={[0.335, 0.2]} bend={0.3} seed="hero-callout" delay={3300} run className="home-callout" />
        <PenArt scene={scene} id="hero-art" parallax pen className="home-art" life={{ 0: <HeroSky />, 1: <HeroLake />, 2: <HeroTrees /> }} />
        <StickyNote className="home-sticky" />
      </div>
    </section>
  );
}
