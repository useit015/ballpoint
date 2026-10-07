import { Button } from "@/registry/ballpoint/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/registry/ballpoint/ui/dropdown-menu";
import { InkIcon } from "@/registry/ballpoint/ui/ink-icons";

const rows = ["Shopping list", "Meeting notes", "Sketches"];

export default function DropdownMenuRowActions() {
  return (
    <ul className="flex w-full max-w-sm flex-col gap-2">
      {rows.map((row) => (
        <li key={row} className="flex items-center justify-between gap-4">
          <span>{row}</span>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${row}`} seed={`dr-${row}`} />}>
              <InkIcon name="more" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" seed={`dr-${row}-menu`} className="w-40">
              <DropdownMenuItem>Open</DropdownMenuItem>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>
      ))}
    </ul>
  );
}
