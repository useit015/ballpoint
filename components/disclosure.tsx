import type { ReactNode } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/ballpoint/ui/accordion";

/** One folded-away section: the registry's Accordion with a single item. */
export function Disclosure({ summary, children, seed }: { summary: ReactNode; children: ReactNode; seed?: string }) {
  return (
    <Accordion>
      <AccordionItem value="more">
        <AccordionTrigger seed={seed} className="w-fit flex-none gap-3 py-2 text-base font-normal text-ink-2 hover:text-ink">
          {summary}
        </AccordionTrigger>
        <AccordionContent keepMounted>
          <div className="flex flex-col gap-4 pt-2">{children}</div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
