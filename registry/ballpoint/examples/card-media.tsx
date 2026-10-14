import { Badge } from "@/registry/ballpoint/ui/badge";
import { Button } from "@/registry/ballpoint/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle } from "@/registry/ballpoint/ui/card";
import { InkIcon, type IconName } from "@/registry/ballpoint/ui/ink-icons";

const goods: { name: string; note: string; price: string; icon: IconName; tag?: string }[] = [
  { name: "Cream notebook", note: "A5, 96 pages, lies flat.", price: "£8", icon: "notebook", tag: "New" },
  { name: "Blue ballpoint", note: "Medium point, refillable.", price: "£3", icon: "pen" },
  { name: "Morning coffee", note: "For the long first page.", price: "£4", icon: "coffee" },
];

export default function CardMediaExample() {
  return (
    <div className="grid w-full gap-10 sm:grid-cols-3">
      {goods.map((item) => (
        <Card key={item.name} size="sm" seed={`cm-${item.name}`}>
          {/* Anything goes up here: a photo, an illustration, an icon. It runs edge to edge. */}
          <CardMedia className="h-32 items-center justify-center bg-ink-5/30 text-ink-2">
            <InkIcon name={item.icon} className="size-14" />
            {item.tag && (
              <Badge className="absolute top-3 left-3" seed={`cm-b-${item.name}`}>
                {item.tag}
              </Badge>
            )}
          </CardMedia>
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.note}</CardDescription>
          </CardHeader>
          <CardContent className="text-2xl font-bold tabular-nums">{item.price}</CardContent>
          <CardFooter>
            <Button size="sm" variant="outline" className="w-full" seed={`cm-buy-${item.name}`}>
              Add
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
