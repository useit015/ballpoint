import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/ballpoint/ui/card";
import { InkIcon, type IconName } from "@/registry/ballpoint/ui/ink-icons";
import { SectionHeading } from "@/registry/ballpoint/ui/section-heading";
import { AnnotateDemo, ChecklistDemo, MarginNoteDemo, RedactDemo, ScrawlDemo, SignatureDemo } from "@/components/home/demos";
import { Callout } from "@/components/home/callout";
import { Doodle } from "@/components/home/doodle";
import { TornSheet } from "@/components/torn-sheet";
import { IntentLink } from "@/components/intent-link";
import { paperclip } from "@/lib/art/doodles";

function Demo({ id, icon, title, caption, className, children }: { id: string; icon: IconName; title: string; caption: string; className?: string; children: ReactNode }) {
  return (
    <Card id={`demo-${id}`} seed={`demo-card-${id}`} className={cn("demo", className)}>
      <CardHeader>
        <CardTitle className="demo-title">
          <InkIcon name={icon} className="size-6 shrink-0 text-ink-2" />
          <IntentLink href={`/docs/${id}`} className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-ink-4">
            {title}
          </IntentLink>
        </CardTitle>
      </CardHeader>
      <CardContent className="demo-content">
        <div className="demo-stage">{children}</div>
        <p className="demo-caption">{caption}</p>
      </CardContent>
    </Card>
  );
}

/** "Components, out of the box": the paper-native set, each one working. */
export function Showcase() {
  return (
    <TornSheet aria-labelledby="components" edge="a" className="home-sheet" style={{ "--tilt": "-0.25deg" } as React.CSSProperties}>
      <Doodle scene={paperclip("sheet-clip")} scale={1.1} run className="sheet-clip" />
      <header className="home-head showcase-head">
        <SectionHeading id="components" underline="swoosh" seed="home-components" className="home-h2">
          Components, out of the box
        </SectionHeading>
        <p className="home-sub">Familiar patterns. A little more personal.</p>
        <Callout lines={["Go on, click them."]} target="demo-redact" bend={0.3} seed="showcase-callout" delay={200} className="showcase-callout" />
      </header>
      <div className="home-cards">
        <Demo id="annotate" icon="pen" title="Annotate" caption="Add context, highlights or callouts to any content." className="demo-1">
          <AnnotateDemo />
        </Demo>
        <Demo id="margin-note" icon="notebook" title="Margin Note" caption="Add thoughtful notes in the margins. Literally." className="demo-2">
          <MarginNoteDemo />
        </Demo>
        <Demo id="redact" icon="eye-off" title="Redact" caption="Hide content with a familiar, tactile component." className="demo-3">
          <RedactDemo />
        </Demo>
        <Demo id="scrawl" icon="wand" title="Scrawl" caption="Add a little chaos. Perfect interfaces are boring." className="demo-4">
          <ScrawlDemo />
        </Demo>
        <Demo id="checklist" icon="check-square" title="Checklist" caption="A clean, flexible list for any workflow." className="demo-5">
          <ChecklistDemo />
        </Demo>
        <Demo id="signature-pad" icon="edit" title="Signature Pad" caption="Capture signatures, sketches or ideas right on the page." className="demo-6">
          <SignatureDemo />
        </Demo>
      </div>
    </TornSheet>
  );
}
