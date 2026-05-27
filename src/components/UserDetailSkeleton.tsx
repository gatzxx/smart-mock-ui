import { memo } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const UserDetailSkeleton = memo(function UserDetailSkeleton() {
  return (
    <Card data-testid="user-detail-skeleton">
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="size-16 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-56" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton className="h-4 w-full max-w-md" />
        <Skeleton className="h-4 w-full max-w-sm" />
        <Skeleton className="h-20 w-full" />
      </CardContent>
    </Card>
  );
});
