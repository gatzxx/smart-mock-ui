import { memo, useCallback, useMemo } from "react";

import { useUsers } from "@/hooks/useUsers";
import { UserTable } from "./UserTable";
import { UsersEmpty } from "./UsersEmpty";
import { UsersError } from "./UsersError";
import { UsersSkeleton } from "./UsersSkeleton";

export const UsersPage = memo(function UsersPage() {
  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    [],
  );

  const { data, isPending, isError, error, refetch } = useUsers(apiBaseUrl);

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const errorMessage = useMemo(() => {
    if (error instanceof Error) {
      return error.message;
    }
    return "Не удалось загрузить данные";
  }, [error]);

  if (isPending) {
    return <UsersSkeleton />;
  }

  if (isError) {
    return <UsersError message={errorMessage} onRetry={handleRetry} />;
  }

  if (!data || data.length === 0) {
    return <UsersEmpty />;
  }

  return <UserTable users={data} />;
});
