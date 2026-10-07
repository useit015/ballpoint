import { Timeline, TimelineDescription, TimelineItem, TimelineTime, TimelineTitle } from "@/registry/ballpoint/ui/timeline";

export default function TimelineVertical() {
  return (
    <Timeline orientation="vertical" seed="timeline-vertical" className="w-full max-w-sm">
      <TimelineItem>
        <TimelineTitle>Ordered</TimelineTitle>
        <TimelineTime dateTime="2026-10-01">Oct 1</TimelineTime>
        <TimelineDescription>A box of blue ballpoints.</TimelineDescription>
      </TimelineItem>
      <TimelineItem>
        <TimelineTitle>Shipped</TimelineTitle>
        <TimelineTime dateTime="2026-10-03">Oct 3</TimelineTime>
      </TimelineItem>
      <TimelineItem>
        <TimelineTitle>Delivered</TimelineTitle>
        <TimelineTime dateTime="2026-10-06">Oct 6</TimelineTime>
        <TimelineDescription>Left on the doorstep, in the rain.</TimelineDescription>
      </TimelineItem>
    </Timeline>
  );
}
