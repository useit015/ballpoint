import { Progress, ProgressLabel, ProgressValue } from "@/registry/ballpoint/ui/progress";

export default function ProgressDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      <Progress value={30} seed="pr-30">
        <ProgressLabel>Uploading</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={66} fill="hatch" seed="pr-66">
        <ProgressLabel>Hatched</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={100} seed="pr-100">
        <ProgressLabel>Done</ProgressLabel>
        <ProgressValue />
      </Progress>
      <Progress value={null} seed="pr-indeterminate">
        <ProgressLabel>Working on it</ProgressLabel>
      </Progress>
    </div>
  );
}
