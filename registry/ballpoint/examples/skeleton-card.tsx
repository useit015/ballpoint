import { Card, CardContent, CardHeader } from "@/registry/ballpoint/ui/card";
import { Skeleton } from "@/registry/ballpoint/ui/skeleton";

export default function SkeletonCard() {
  return (
    <Card className="w-full max-w-sm" seed="sc-card">
      <CardHeader>
        <Skeleton className="h-5 w-40" seed="sc-title" />
        <Skeleton className="h-4 w-56" seed="sc-sub" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Skeleton className="h-32 w-full" seed="sc-image" />
        <Skeleton className="h-4 w-full" seed="sc-l1" />
        <Skeleton className="h-4 w-2/3" seed="sc-l2" />
      </CardContent>
    </Card>
  );
}
