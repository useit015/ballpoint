import Link from "next/link";
import { SectionHeading } from "@/registry/ballpoint/ui/section-heading";
import { Annotate } from "@/registry/ballpoint/ui/annotate";
import { Callout } from "@/components/home/callout";
import { Doodle } from "@/components/home/doodle";
import { FooterArt } from "@/components/home/footer-art";
import { InstallCommand } from "@/components/install-command";
import { IntentLink } from "@/components/intent-link";
import { penDoodle } from "@/lib/art/doodles";
import { homepage } from "@/registry/manifest";

/** "Put the paper and ink in your app": the one command that starts it. */
export function Start() {
  return (
    <section aria-labelledby="start" className="home-start">
      <div className="start-body">
        <div className="start-head">
          <SectionHeading id="start" underline="swoosh" seed="home-start" className="home-h2">
            Put the paper and ink in your app
          </SectionHeading>
          <Doodle scene={penDoodle("start-pen")} scale={0.95} className="start-pen" />
        </div>
        <p className="home-sub">One command adds the paper, the ink and the stroke engine. After that, each component is its own add.</p>
        <div className="start-cmd">
          <div id="start-command">
            <InstallCommand what={`init ${homepage}/r/ballpoint.json`} />
          </div>
          <Callout lines={["Then add what you need."]} target="start-command" bend={-0.3} seed="start-callout" delay={300} className="start-callout" />
        </div>
      </div>
    </section>
  );
}

const columns = [
  {
    title: "Library",
    links: [
      { label: "Components", href: "/components" },
      { label: "Docs", href: "/docs" },
      { label: "Customize", href: "/customize" },
      { label: "Pens and papers", href: "/docs/themes" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Installation", href: "/docs" },
      { label: "llms.txt", href: "/llms.txt" },
      { label: "llms-full.txt", href: "/llms-full.txt" },
      { label: "Registry", href: `${homepage}/r/ballpoint.json` },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "GitHub", href: "https://github.com/useit015/ballpoint" },
      { label: "MIT license", href: "https://github.com/useit015/ballpoint/blob/main/LICENSE" },
      { label: "Drawn by Ouss", href: "https://st9wd.com" },
    ],
  },
];

/** The foot of the page: links in a few columns, and the hillside below them. */
export function HomeFooter() {
  return (
    <footer className="home-footer">
      <div className="foot-top">
        <div className="foot-brand">
          <Link href="/" className="foot-logo">
            Ballpoint
          </Link>
          <p>Components you can write on. Same names, same props, drawn by hand.</p>
        </div>
        <nav aria-label="Footer" className="foot-cols">
          {columns.map((col) => (
            <div key={col.title} className="foot-col">
              <h2 className="foot-title">
                <Annotate type="underline" seed={`foot-${col.title}`}>
                  {col.title}
                </Annotate>
              </h2>
              <ul>
                {col.links.map((l) => {
                  const external = /^https?:/.test(l.href) && !l.href.startsWith(homepage + "/llms");
                  return (
                    <li key={l.label}>
                      {external || l.href.endsWith(".txt") ? (
                        <a href={l.href} className="foot-link">
                          {l.label}
                        </a>
                      ) : (
                        <IntentLink href={l.href} className="foot-link">
                          {l.label}
                        </IntentLink>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
        <p className="foot-legal">MIT licensed. The components are yours once you add them.</p>
      </div>
      <FooterArt />
    </footer>
  );
}
