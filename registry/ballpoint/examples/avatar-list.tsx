import { Avatar, AvatarBadge, AvatarFallback } from "@/registry/ballpoint/ui/avatar";

const people = [
  ["AL", "Ada Lovelace", "ada@example.com", true],
  ["GH", "Grace Hopper", "grace@example.com", false],
  ["KJ", "Katherine Johnson", "katherine@example.com", true],
] as const;

export default function AvatarList() {
  return (
    <ul className="flex w-full max-w-sm flex-col gap-5">
      {people.map(([initials, name, email, online]) => (
        <li key={initials} className="flex items-center gap-4">
          <Avatar size="lg" seed={`al-${initials}`}>
            <AvatarFallback>{initials}</AvatarFallback>
            {online && <AvatarBadge seed={`al-dot-${initials}`} />}
          </Avatar>
          <div className="flex min-w-0 flex-col">
            <span className="font-bold">{name}</span>
            <span className="truncate text-sm text-ink-3">{email}</span>
          </div>
        </li>
      ))}
    </ul>
  );
}
