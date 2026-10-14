import { Skeleton, SkeletonText } from "@/registry/ballpoint/ui/skeleton";

export default function SkeletonTextExample() {
  return (
    <article className="flex w-full max-w-md flex-col gap-4">
      <Skeleton className="h-7 w-2/3" seed="st-title" />
      <SkeletonText lines={4} seed="st-body" />
      <SkeletonText lines={2} seed="st-more" />
    </article>
  );
}
