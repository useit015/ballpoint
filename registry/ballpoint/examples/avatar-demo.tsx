import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from "@/registry/ballpoint/ui/avatar";

export default function AvatarDemo() {
  return (
    <div className="flex flex-wrap items-center gap-8">
      <Avatar size="lg" seed="av-image">
        <AvatarImage src="/doodle-portrait.svg" alt="A doodled portrait" />
        <AvatarFallback>DP</AvatarFallback>
      </Avatar>
      <Avatar seed="av-fallback">
        <AvatarFallback>AL</AvatarFallback>
        <AvatarBadge seed="av-dot" />
      </Avatar>
      <Avatar size="sm" seed="av-small">
        <AvatarFallback>GH</AvatarFallback>
      </Avatar>
      <AvatarGroup>
        {["AL", "GH", "KJ"].map((initials) => (
          <Avatar key={initials} seed={`av-group-${initials}`}>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        ))}
        <AvatarGroupCount>+4</AvatarGroupCount>
      </AvatarGroup>
    </div>
  );
}
