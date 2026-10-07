import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/ballpoint/ui/card";

const stats = [
  ["Pages written", "1,284", "+12% this month"],
  ["Ink used", "62 ml", "About half a refill"],
  ["Doodles", "389", "Mostly in margins"],
] as const;

export default function CardStats() {
  return (
    <div className="grid w-full gap-6 sm:grid-cols-3">
      {stats.map(([label, value, note]) => (
        <Card key={label} size="sm" seed={`cs-${label}`}>
          <CardHeader>
            <CardDescription>{label}</CardDescription>
            <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-ink-3">{note}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
