import { Skeleton, SkeletonText } from "@/registry/ballpoint/ui/skeleton";

export default function SkeletonProfile() {
  return (
    <ul className="flex w-full max-w-md flex-col gap-6">
      {[0, 1, 2].map((i) => (
        <li key={i} className="flex items-start gap-4">
          <Skeleton className="size-12 shrink-0 rounded-full" seed={`sp-avatar-${i}`} />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-5 w-1/3" seed={`sp-name-${i}`} />
            <SkeletonText lines={2} seed={`sp-text-${i}`} />
          </div>
        </li>
      ))}
    </ul>
  );
}
