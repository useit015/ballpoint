import { Badge } from "@/registry/ballpoint/ui/badge";

const orders = [
  ["Blue ballpoints, box of 50", "Paid", "default"],
  ["Cream notebooks, A5", "Pending", "secondary"],
  ["Fineliner set", "Shipped", "outline"],
  ["Legal pads, pack of 6", "Refunded", "destructive"],
] as const;

export default function BadgeStatus() {
  return (
    <ul className="flex w-full max-w-md flex-col gap-4">
      {orders.map(([item, status, variant]) => (
        <li key={item} className="flex items-center justify-between gap-4">
          <span>{item}</span>
          <Badge variant={variant} seed={`bs-${status}`}>
            {status}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
