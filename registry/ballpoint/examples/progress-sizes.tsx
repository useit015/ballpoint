import { Progress, ProgressLabel, ProgressValue } from "@/registry/ballpoint/ui/progress";

const sizes = [
  ["sm", 30],
  ["default", 55],
  ["lg", 80],
] as const;

export default function ProgressSizes() {
  return (
    <div className="flex w-full max-w-md flex-col gap-8">
      {sizes.map(([size, value]) => (
        <Progress key={size} size={size} value={value} seed={`psz-${size}`}>
          <ProgressLabel>{size}</ProgressLabel>
          <ProgressValue />
        </Progress>
      ))}
    </div>
  );
}
