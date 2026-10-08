"use client";

import { useCallback, useRef, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/registry/ballpoint/ui/accordion";
import { Checkbox } from "@/registry/ballpoint/ui/checkbox";
import { Checklist, ChecklistItem } from "@/registry/ballpoint/ui/checklist";
import { Field, FieldLabel } from "@/registry/ballpoint/ui/field";
import { Popover, PopoverContent, PopoverTrigger } from "@/registry/ballpoint/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/registry/ballpoint/ui/tabs";

/** Small consumer fixtures for the component contract tests. */
export function ComponentContracts() {
  const objectRef = useRef<HTMLLabelElement>(null);
  const callbackRef = useRef<HTMLLabelElement | null>(null);
  const capture = useCallback((label: HTMLLabelElement | null) => { callbackRef.current = label; }, []);
  const [refs, setRefs] = useState("");
  return (
    <>
      <Checkbox aria-label="Callback checkbox" className={(state) => state.checked ? "consumer-checked" : "consumer-unchecked"} />
      <Tabs defaultValue="first">
        <TabsList>
          <TabsTrigger value="first" className={(state) => state.active ? "consumer-active" : "consumer-inactive"}>First</TabsTrigger>
          <TabsTrigger value="second" className={(state) => state.active ? "consumer-active" : "consumer-inactive"}>Second</TabsTrigger>
        </TabsList>
      </Tabs>
      <Popover>
        <PopoverTrigger>Open callback popover</PopoverTrigger>
        <PopoverContent className={(state) => state.open ? "consumer-open" : "consumer-closed"}>Callback content</PopoverContent>
      </Popover>
      <Accordion>
        <AccordionItem value="callback">
          <AccordionTrigger header={{ className: (state) => state.open ? "consumer-header-open" : "consumer-header-closed" }}>Callback accordion</AccordionTrigger>
          <AccordionContent>Callback panel</AccordionContent>
        </AccordionItem>
      </Accordion>
      <Checklist onValueChange={(_, details) => details.cancel()}>
        <ChecklistItem value="blocked">Blocked completion</ChecklistItem>
      </Checklist>
      <Checklist>
        <ChecklistItem value="allowed">Allowed completion</ChecklistItem>
      </Checklist>
      <FieldLabel ref={objectRef} data-testid="object-card">
        <Field orientation="horizontal"><Checkbox aria-label="Object ref choice" />Object ref</Field>
      </FieldLabel>
      <FieldLabel ref={capture} data-testid="callback-card">
        <Field orientation="horizontal"><Checkbox aria-label="Callback ref choice" />Callback ref</Field>
      </FieldLabel>
      <button onClick={() => setRefs(`${objectRef.current?.tagName ?? "missing"},${callbackRef.current?.tagName ?? "missing"}`)}>Read refs</button>
      <output>{refs}</output>
    </>
  );
}
