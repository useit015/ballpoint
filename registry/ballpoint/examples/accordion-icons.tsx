import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/ballpoint/ui/accordion";
import { InkIcon, type IconName } from "@/registry/ballpoint/ui/ink-icons";

const items: { icon: IconName; title: string; body: string }[] = [
  { icon: "pen", title: "Pens", body: "Four to start with, each with a night colour that clears 4.5:1 on every paper." },
  { icon: "notebook", title: "Papers", body: "Cream, white and legal pad, ruled, squared or dotted, with coffee rings if you like." },
  { icon: "moon", title: "Night", body: "Every drawing has a night side. The lamp comes on over the top of the page." },
];

export default function AccordionIcons() {
  return (
    <Accordion defaultValue={["Pens"]} className="max-w-lg">
      {items.map(({ icon, title, body }) => (
        <AccordionItem key={title} value={title}>
          <AccordionTrigger seed={`ai-${title}`}>
            <span className="flex items-center gap-3">
              <InkIcon name={icon} className="size-5 text-ink-2" />
              {title}
            </span>
          </AccordionTrigger>
          <AccordionContent>{body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
