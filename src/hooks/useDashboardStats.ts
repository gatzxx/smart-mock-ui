import { useCallback, useMemo } from "react";

import { useHealth } from "@/hooks/useHealth";
import { useProducts } from "@/hooks/useProducts";
import { useUsers } from "@/hooks/useUsers";

export function useDashboardStats(apiBaseUrl: string) {
  const usersQuery = useUsers(apiBaseUrl);
  const productsQuery = useProducts(apiBaseUrl);
  const healthQuery = useHealth(apiBaseUrl);

  const isPending = useMemo(
    () => usersQuery.isPending || productsQuery.isPending,
    [productsQuery.isPending, usersQuery.isPending],
  );

  const isError = useMemo(
    () => usersQuery.isError || productsQuery.isError,
    [productsQuery.isError, usersQuery.isError],
  );

  const error = useMemo(
    () => usersQuery.error ?? productsQuery.error,
    [productsQuery.error, usersQuery.error],
  );

  const refetchAll = useCallback(() => {
    void usersQuery.refetch();
    void productsQuery.refetch();
    void healthQuery.refetch();
  }, [healthQuery, productsQuery, usersQuery]);

  return {
    usersCount: usersQuery.data?.length ?? 0,
    productsCount: productsQuery.data?.length ?? 0,
    healthQuery,
    isPending,
    isError,
    error,
    refetchAll,
  };
}
