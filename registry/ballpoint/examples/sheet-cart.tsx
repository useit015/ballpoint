"use client";

import { useState } from "react";
import { Button } from "@/registry/ballpoint/ui/button";
import { Separator } from "@/registry/ballpoint/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/registry/ballpoint/ui/sheet";

const start = [
  { name: "Cream notebook", price: 8, qty: 2 },
  { name: "Blue ballpoint", price: 3, qty: 1 },
];

export default function SheetCart() {
  const [items, setItems] = useState(start);
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" seed="sc-open" />}>Basket ({items.reduce((n, i) => n + i.qty, 0)})</SheetTrigger>
      <SheetContent seed="sc">
        <SheetHeader>
          <SheetTitle>Your basket</SheetTitle>
          <SheetDescription>{items.length ? "Everything here ships together." : "Nothing in it yet."}</SheetDescription>
        </SheetHeader>
        <ul className="flex flex-col gap-4 px-6">
          {items.map((item, i) => (
            <li key={item.name} className="flex flex-col gap-4">
              {i > 0 && <Separator seed={`sc-rule-${i}`} />}
              <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col">
                  <span className="font-bold">{item.name}</span>
                  <span className="text-sm text-ink-3">
                    £{item.price} × {item.qty}
                  </span>
                </div>
                <Button variant="ghost" size="sm" seed={`sc-rm-${i}`} onClick={() => setItems((all) => all.filter((x) => x !== item))}>
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
        <SheetFooter>
          <div className="flex items-baseline justify-between">
            <span className="text-ink-2">Total</span>
            <span className="text-2xl font-bold tabular-nums">£{total}</span>
          </div>
          <Button disabled={!items.length} seed="sc-pay">
            Check out
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
