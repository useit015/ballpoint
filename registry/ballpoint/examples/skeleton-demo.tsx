import { Skeleton } from "@/registry/ballpoint/ui/skeleton";

export default function SkeletonDemo() {
  return (
    <div className="flex items-center gap-4">
      <Skeleton className="size-12 rounded-full" seed="sk-avatar" />
      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-56" seed="sk-line-1" />
        <Skeleton className="h-4 w-40" seed="sk-line-2" />
      </div>
    </div>
  );
}
