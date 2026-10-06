import { Badge } from "@/registry/ballpoint/ui/badge";
import { Button } from "@/registry/ballpoint/ui/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ballpoint/ui/card";

export default function CardDemo() {
  return (
    <div className="grid w-full gap-8 md:grid-cols-2">
      <Card seed="card-a">
        <CardHeader>
          <CardTitle>Ink refill</CardTitle>
          <CardDescription>Medium point, blue. Writes about two kilometres.</CardDescription>
          <CardAction>
            <Badge variant="secondary" seed="card-badge">
              In stock
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="text-ink-2">Fits most clicky pens. Comes in a paper sleeve, not plastic.</p>
        </CardContent>
        <CardFooter>
          <Button size="sm" seed="card-buy">
            Add to basket
          </Button>
          <Button size="sm" variant="ghost" seed="card-save">
            Save for later
          </Button>
        </CardFooter>
      </Card>
      <Card size="sm" radius={12} seed="card-b">
        <CardHeader>
          <CardTitle>Rounded, smaller</CardTitle>
          <CardDescription>size=&quot;sm&quot; with a 12px radius.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-ink-2">Cards take the same pen settings as everything else.</p>
        </CardContent>
      </Card>
    </div>
  );
}
