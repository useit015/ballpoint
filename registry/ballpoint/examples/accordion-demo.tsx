import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/ballpoint/ui/accordion";

const faq = [
  ["Is it accessible?", "Yes. Every component is built on Base UI, checked with axe in both themes, and keyboard-tested. The drawing is decoration; the semantics are the primitive's."],
  ["Does it work without JavaScript?", "The page renders with every stroke already drawn. Scripts add the measuring and the drawing in."],
  ["Can I change the pen?", "Per component, for a section, or for the whole app: see the customizer."],
];

export default function AccordionDemo() {
  return (
    <Accordion defaultValue={["item-0"]} className="max-w-lg">
      {faq.map(([question, answer], i) => (
        <AccordionItem key={i} value={`item-${i}`}>
          <AccordionTrigger seed={`acc-${i}`}>{question}</AccordionTrigger>
          <AccordionContent>{answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
