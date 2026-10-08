import { highlight } from "@/lib/highlight";
import { CodeFrame } from "@/components/code-frame";

/** The back of the stage's card: the code that draws its front, as you'd write it with the registry. */
export async function CardCode({ count }: { count: number }) {
  const code = `<Card>
  <CardHeader>
    <CardTitle>Launch day</CardTitle>
    <CardAction>
      <Badge variant="outline">Friday</Badge>
    </CardAction>
  </CardHeader>
  <CardContent>
    <Progress value={done.length * 33} />
    <Checklist value={done} onValueChange={setDone}>
      <ChecklistItem value="draw">
        Draw ${count} components
      </ChecklistItem>
      <ChecklistItem value="pens">
        Test every pen
      </ChecklistItem>
      <ChecklistItem value="tell">
        Tell people
      </ChecklistItem>
    </Checklist>
    <Label>
      <Switch defaultChecked /> Remind the team
    </Label>
  </CardContent>
  <CardFooter>
    <Button>Ship it</Button>
    <Button variant="ghost">Not yet</Button>
  </CardFooter>
</Card>`;
  const html = await highlight(code, "tsx");
  return (
    <CodeFrame className="h-full overflow-hidden" header={<span className="text-sm text-ink-3">launch-day.tsx</span>}>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </CodeFrame>
  );
}
