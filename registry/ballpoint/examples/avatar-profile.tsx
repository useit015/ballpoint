import { Avatar, AvatarBadge, AvatarFallback } from "@/registry/ballpoint/ui/avatar";
import { Badge } from "@/registry/ballpoint/ui/badge";
import { Button } from "@/registry/ballpoint/ui/button";

export default function AvatarProfile() {
  return (
    <div className="flex w-full max-w-md items-center gap-5">
      <Avatar size="xl" seed="apr-grace">
        <AvatarFallback>GH</AvatarFallback>
        <AvatarBadge seed="apr-dot" />
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xl font-bold">Grace Hopper</span>
          <Badge variant="secondary" size="sm" seed="apr-role">
            Editor
          </Badge>
        </div>
        <span className="text-ink-3">Writing since 1952. Online now.</span>
      </div>
      <Button variant="outline" size="sm" seed="apr-follow">
        Follow
      </Button>
    </div>
  );
}
