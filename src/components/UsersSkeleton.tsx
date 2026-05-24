import { memo } from "react";

const SKELETON_ROW_COUNT = 5;

export const UsersSkeleton = memo(function UsersSkeleton() {
  return (
    <div className="users-skeleton" data-testid="users-skeleton">
      {Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <div key={index} className="skeleton-row" />
      ))}
    </div>
  );
});
