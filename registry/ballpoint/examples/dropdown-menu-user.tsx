import { Avatar, AvatarFallback } from "@/registry/ballpoint/ui/avatar";
import { Button } from "@/registry/ballpoint/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/registry/ballpoint/ui/dropdown-menu";

export default function DropdownMenuUser() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" className="h-auto gap-3 px-2 py-1.5" seed="mu-open" />}>
        <Avatar seed="mu-avatar">
          <AvatarFallback>GH</AvatarFallback>
        </Avatar>
        <span className="flex flex-col items-start text-left leading-tight">
          <span className="font-bold">Grace Hopper</span>
          <span className="text-sm text-ink-3">grace@example.com</span>
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent seed="mu" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Signed in</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Help</DropdownMenuItem>
        <DropdownMenuItem variant="destructive">
          Sign out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
