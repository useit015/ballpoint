import { Badge } from "@/registry/ballpoint/ui/badge";
import { Button } from "@/registry/ballpoint/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/registry/ballpoint/ui/card";
import { InkGlyph } from "@/registry/ballpoint/lib/ink-glyphs";

const plans = [
  { name: "Pencil", price: "£0", note: "To try it out.", features: ["One notebook", "Cream paper"] },
  { name: "Ballpoint", price: "£6", note: "For everyday writing.", features: ["Unlimited notebooks", "Every pen and paper", "Night side"], popular: true },
  { name: "Fountain", price: "£18", note: "For a whole team.", features: ["Everything in Ballpoint", "Shared notebooks", "Margin notes for all"] },
];

export default function CardPricing() {
  return (
    <div className="grid w-full items-stretch gap-10 sm:grid-cols-3">
      {plans.map((plan) => (
        <Card key={plan.name} variant={plan.popular ? "lifted" : "outline"} size="sm" seed={`cp-${plan.name}`}>
          {plan.popular && (
            <Badge className="absolute -top-3 right-4 z-10" seed="cp-popular">
              Popular
            </Badge>
          )}
          <CardHeader>
            <CardTitle>{plan.name}</CardTitle>
            <CardDescription>{plan.note}</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col gap-4">
            <p>
              <span className="text-4xl font-bold tabular-nums">{plan.price}</span>
              <span className="text-ink-3"> / month</span>
            </p>
            <ul className="flex flex-col gap-2 text-ink-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <InkGlyph name="check" className="size-4 shrink-0 text-ink" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant={plan.popular ? "default" : "outline"} className="w-full" seed={`cp-buy-${plan.name}`}>
              Choose {plan.name}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
