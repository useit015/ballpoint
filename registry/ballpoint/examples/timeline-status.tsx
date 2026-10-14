import { Timeline, TimelineDescription, TimelineItem, TimelineTime, TimelineTitle } from "@/registry/ballpoint/ui/timeline";

export default function TimelineStatus() {
  return (
    <Timeline orientation="vertical" seed="tls" className="w-full max-w-sm">
      <TimelineItem>
        <TimelineTitle>Order placed</TimelineTitle>
        <TimelineTime dateTime="2026-10-01">Oct 1</TimelineTime>
      </TimelineItem>
      <TimelineItem>
        <TimelineTitle>Packed by hand</TimelineTitle>
        <TimelineTime dateTime="2026-10-02">Oct 2</TimelineTime>
        <TimelineDescription>Wrapped in a paper sleeve, not plastic.</TimelineDescription>
      </TimelineItem>
      <TimelineItem status="current">
        <TimelineTitle>On its way</TimelineTitle>
        <TimelineTime dateTime="2026-10-04">Oct 4</TimelineTime>
        <TimelineDescription>With the courier, due Tuesday.</TimelineDescription>
      </TimelineItem>
      <TimelineItem status="upcoming">
        <TimelineTitle>Delivered</TimelineTitle>
        <TimelineTime dateTime="2026-10-06">Oct 6, estimated</TimelineTime>
      </TimelineItem>
    </Timeline>
  );
}
