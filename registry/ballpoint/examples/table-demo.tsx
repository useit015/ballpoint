import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/registry/ballpoint/ui/table";

const orders = [
  ["INV-001", "Blue ballpoints, box of 50", "Paid", "£12.50"],
  ["INV-002", "Cream notebooks, A5", "Pending", "£24.00"],
  ["INV-003", "Fineliner set", "Paid", "£9.80"],
  ["INV-004", "Legal pads, pack of 6", "Refunded", "£15.00"],
];

export default function TableDemo() {
  return (
    <Table>
      <TableCaption>Recent orders.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Invoice</TableHead>
          <TableHead>Item</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map(([invoice, item, status, amount]) => (
          <TableRow key={invoice}>
            <TableCell className="font-bold">{invoice}</TableCell>
            <TableCell>{item}</TableCell>
            <TableCell className="text-ink-2">{status}</TableCell>
            <TableCell className="text-right tabular-nums">{amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right tabular-nums">£61.30</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
}
