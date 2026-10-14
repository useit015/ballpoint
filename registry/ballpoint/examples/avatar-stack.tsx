import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount } from "@/registry/ballpoint/ui/avatar";

const people = ["AL", "GH", "KJ", "MJ", "DV"];

export default function AvatarStack() {
  const shown = people.slice(0, 3);
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <AvatarGroup>
          {shown.map((initials) => (
            <Avatar key={initials} seed={`ast-${initials}`}>
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount seed="ast-more">+{people.length - shown.length}</AvatarGroupCount>
        </AvatarGroup>
        <span className="text-ink-2">Ada, Grace, Katherine and 2 others are writing.</span>
      </div>
      <AvatarGroup>
        {people.map((initials) => (
          <Avatar key={initials} size="lg" seed={`ast-lg-${initials}`}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
      </AvatarGroup>
    </div>
  );
}
