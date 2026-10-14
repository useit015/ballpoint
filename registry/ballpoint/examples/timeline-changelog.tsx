import { Badge } from "@/registry/ballpoint/ui/badge";
import { Timeline, TimelineDescription, TimelineItem, TimelineTime, TimelineTitle } from "@/registry/ballpoint/ui/timeline";

const releases = [
  { version: "1.2", date: "2026-10-14", tag: "New", note: "Torn edges, tape and tilt for Paper." },
  { version: "1.1", date: "2026-09-02", tag: "Fixed", note: "Selects open over the trigger, like native ones." },
  { version: "1.0", date: "2026-07-20", tag: "First", note: "Forty components, drawn." },
];

export default function TimelineChangelog() {
  return (
    <Timeline orientation="vertical" seed="tlc" className="w-full max-w-md">
      {releases.map((release) => (
        <TimelineItem key={release.version}>
          <TimelineTitle className="flex items-center gap-3">
            v{release.version}
            <Badge variant={release.tag === "New" ? "default" : "outline"} size="sm" seed={`tlc-${release.version}`}>
              {release.tag}
            </Badge>
          </TimelineTitle>
          <TimelineTime dateTime={release.date}>{new Date(release.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })}</TimelineTime>
          <TimelineDescription>{release.note}</TimelineDescription>
        </TimelineItem>
      ))}
    </Timeline>
  );
}
