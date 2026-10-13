import "../art.css";
import "../docs.css";
import "../sheets.css";
import "../torn.css";
import type { Metadata } from "next";
import { ComponentIndex } from "@/components/component-index";
import { DocHeader } from "@/components/doc-header";
import { Doodle } from "@/components/home/doodle";
import { TextLink } from "@/components/text-link";
import { penDoodle } from "@/lib/art/doodles";
import { ordered } from "@/lib/nav";

export const metadata: Metadata = {
  title: "Components",
  description: "Every Ballpoint component, from Accordion to Tooltip, and the ones only a pen can draw.",
};

const docs = ordered.map(({ name, title, description, group }) => ({ name, title, description, group }));

export default function Components() {
  return (
    <main id="main" className="mx-auto flex w-full max-w-[85rem] flex-1 flex-col gap-12 px-4 pt-8 pb-28 sm:px-8 sm:pt-12">
      <DocHeader
        id="components"
        title="Components"
        lede={
          <>
            {ordered.length} components, each added on its own with the shadcn CLI. Start with the <TextLink href="/docs">installation</TextLink>, then pick what you need.
          </>
        }
        crumbs={[{ title: "Components" }]}
        art={<Doodle scene={penDoodle("index-pen")} scale={1.6} run className="size-full" />}
      />
      <ComponentIndex docs={docs} />
    </main>
  );
}
