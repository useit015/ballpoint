import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/registry/ballpoint/ui/table";

const pens = [
  ["Blue ballpoint", "14", "1,284", "Everyday"],
  ["Black fineliner", "9", "612", "Drawings"],
  ["Pencil", "21", "2,031", "Drafts"],
  ["Green ink", "3", "88", "Corrections"],
  ["Red pen", "2", "41", "Only when it matters"],
];

export default function TableStriped() {
  return (
    <Table variant="striped" columns size="compact">
      <TableCaption>Pens in use this year.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Pen</TableHead>
          <TableHead className="text-right">Weeks</TableHead>
          <TableHead className="text-right">Pages</TableHead>
          <TableHead>Used for</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pens.map(([pen, weeks, pages, use]) => (
          <TableRow key={pen}>
            <TableCell className="font-bold">{pen}</TableCell>
            <TableCell className="text-right tabular-nums">{weeks}</TableCell>
            <TableCell className="text-right tabular-nums">{pages}</TableCell>
            <TableCell className="text-ink-2">{use}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
