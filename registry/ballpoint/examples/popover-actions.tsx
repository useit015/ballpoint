import { Avatar, AvatarFallback } from "@/registry/ballpoint/ui/avatar";
import { Button } from "@/registry/ballpoint/ui/button";
import { Popover, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger } from "@/registry/ballpoint/ui/popover";

export default function PopoverActions() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="ghost" size="icon" aria-label="Ada Lovelace" seed="pa-open" />}>
        <Avatar size="sm" seed="pa-avatar">
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
      </PopoverTrigger>
      <PopoverContent seed="pa" className="w-72" align="start">
        <div className="flex items-center gap-3">
          <Avatar size="lg" seed="pa-avatar-lg">
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
          <div>
            <PopoverTitle>Ada Lovelace</PopoverTitle>
            <PopoverDescription>ada@example.com</PopoverDescription>
          </div>
        </div>
        <div className="flex gap-3">
          <Button size="sm" variant="outline" className="flex-1" seed="pa-profile">
            Profile
          </Button>
          <Button size="sm" variant="ghost" className="flex-1" seed="pa-signout">
            Sign out
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
