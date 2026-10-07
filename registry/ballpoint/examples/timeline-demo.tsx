import { Timeline, TimelineDescription, TimelineItem, TimelineTime, TimelineTitle } from "@/registry/ballpoint/ui/timeline";

export default function TimelineDemo() {
  return (
    <Timeline seed="timeline-demo" className="w-full max-w-2xl">
      <TimelineItem>
        <TimelineTitle>Margins</TimelineTitle>
        <TimelineTime dateTime="2019">2019</TimelineTime>
        <TimelineDescription>Doodles in every notebook.</TimelineDescription>
      </TimelineItem>
      <TimelineItem>
        <TimelineTitle>A button</TimelineTitle>
        <TimelineTime dateTime="2023">2023</TimelineTime>
        <TimelineDescription>The first one drawn with a pen.</TimelineDescription>
      </TimelineItem>
      <TimelineItem>
        <TimelineTitle>A portfolio</TimelineTitle>
        <TimelineTime dateTime="2025">2025</TimelineTime>
        <TimelineDescription>All of it in blue ballpoint.</TimelineDescription>
      </TimelineItem>
      <TimelineItem>
        <TimelineTitle>Ballpoint</TimelineTitle>
        <TimelineTime dateTime="2026">2026</TimelineTime>
        <TimelineDescription>The pen, for everyone.</TimelineDescription>
      </TimelineItem>
    </Timeline>
  );
}
