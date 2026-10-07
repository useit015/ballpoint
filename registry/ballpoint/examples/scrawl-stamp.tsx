import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/ballpoint/ui/card";
import { Scrawl } from "@/registry/ballpoint/ui/scrawl";

export default function ScrawlStamp() {
  return (
    <div className="relative w-full max-w-sm">
      <Card seed="ss-card">
        <CardHeader>
          <CardTitle>Draft: launch post</CardTitle>
          <CardDescription>Reviewed by two people.</CardDescription>
        </CardHeader>
        <CardContent className="text-ink-2">Looks good. Ship it on Tuesday.</CardContent>
      </Card>
      <Scrawl kind="star" rotate={-10} delay={400} seed="ss-star" className="absolute -top-5 -right-4" />
      <Scrawl kind="slash" scale={1.4} rotate={-4} delay={900} seed="ss-slash" className="absolute -bottom-3 left-8" />
    </div>
  );
}
