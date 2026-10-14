import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/ballpoint/ui/card";

const kinds = [
  { variant: "outline", note: "Just the pencilled box. The default, and the quietest." },
  { variant: "lifted", note: "Stands off a hatched shadow, like a button does." },
  { variant: "wash", note: "Hatched lightly across, like a note." },
] as const;

export default function CardVariants() {
  return (
    <div className="grid w-full gap-10 sm:grid-cols-3">
      {kinds.map(({ variant, note }) => (
        <Card key={variant} variant={variant} size="sm" seed={`cv-${variant}`}>
          <CardHeader>
            <CardTitle className="font-mono text-base">{variant}</CardTitle>
            <CardDescription>{note}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-ink-3">variant=&quot;{variant}&quot;</p>
          </CardContent>
        </Card>
      ))}
      <Card variant="lifted" shadow="solid" size="sm" seed="cv-solid" className="sm:col-span-3 sm:mx-auto sm:w-1/2">
        <CardHeader>
          <CardTitle className="font-mono text-base">lifted, solid</CardTitle>
          <CardDescription>shadow=&quot;solid&quot; blacks the shadow in.</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
