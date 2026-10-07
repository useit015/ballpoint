import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/ballpoint/ui/accordion";

const sections = [
  ["Shipping", "Orders leave the studio on Tuesdays and Fridays, wrapped in brown paper."],
  ["Returns", "Send anything back within thirty days; unused ink is always welcome."],
  ["Care", "Cap the pen, keep it out of the sun, and never lend it."],
];

// `multiple` lets several items stay open at once; by default opening one closes the others.
export default function AccordionMultiple() {
  return (
    <Accordion multiple defaultValue={["item-0", "item-2"]} className="max-w-lg">
      {sections.map(([title, text], i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger seed={`am-${i}`}>{title}</AccordionTrigger>
          <AccordionContent>{text}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
