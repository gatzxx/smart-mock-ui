import { memo, useMemo } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const SKELETON_CARD_COUNT = 3;

export const DashboardSkeleton = memo(function DashboardSkeleton() {
  const cards = useMemo(
    () =>
      Array.from({ length: SKELETON_CARD_COUNT }, (_, index) => (
        <Card key={index} data-testid="dashboard-skeleton-card">
          <CardHeader className="flex flex-row items-start justify-between gap-3">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
            <Skeleton className="size-10 rounded-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full max-w-xs" />
          </CardContent>
        </Card>
      )),
    [],
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="dashboard-skeleton">
      {cards}
    </div>
  );
});
