import { Redact } from "@/registry/ballpoint/ui/redact";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/registry/ballpoint/ui/table";

const keys = [
  ["Production", "sk_live_51Hx9QeK2", "Active"],
  ["Staging", "sk_test_4eC39HqLy", "Active"],
  ["Old laptop", "sk_live_7dYpm0Zt", "Revoked"],
];

export default function RedactTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Key</TableHead>
          <TableHead>Secret</TableHead>
          <TableHead className="text-right">Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keys.map(([name, secret, status]) => (
          <TableRow key={name}>
            <TableCell className="font-bold">{name}</TableCell>
            <TableCell className="font-mono text-sm">
              <Redact label={`${name} secret`} seed={`rt-${name}`}>
                {secret}
              </Redact>
            </TableCell>
            <TableCell className="text-right text-ink-2">{status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
