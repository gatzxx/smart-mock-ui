import { useCallback, useMemo } from "react";

import { useProducts } from "@/hooks/useProducts";
import type { RefetchResult } from "@/hooks/useRefetchWithToast";
import { useUsers } from "@/hooks/useUsers";
import { useApiAvailability } from "@/providers/ApiAvailabilityProvider";

export function useDashboardStats(apiBaseUrl: string) {
  const { isApiReady, isApiWaking, refetch: refetchHealth } = useApiAvailability();
  const usersQuery = useUsers(apiBaseUrl, { enabled: isApiReady });
  const productsQuery = useProducts(apiBaseUrl, { enabled: isApiReady });

  const isPending = useMemo(
    () => isApiReady && (usersQuery.isPending || productsQuery.isPending),
    [isApiReady, productsQuery.isPending, usersQuery.isPending],
  );

  const isError = useMemo(
    () => isApiReady && (usersQuery.isError || productsQuery.isError),
    [isApiReady, productsQuery.isError, usersQuery.isError],
  );

  const error = useMemo(
    () => usersQuery.error ?? productsQuery.error,
    [productsQuery.error, usersQuery.error],
  );

  const refetchAll = useCallback(async (): Promise<RefetchResult[]> => {
    const results = await Promise.all([
      usersQuery.refetch(),
      productsQuery.refetch(),
      refetchHealth(),
    ]);

    return results.map(({ isSuccess }) => ({ isSuccess }));
  }, [productsQuery, refetchHealth, usersQuery]);

  return {
    usersCount: usersQuery.data?.length ?? 0,
    productsCount: productsQuery.data?.length ?? 0,
    isApiWaking,
    isPending,
    isError,
    error,
    refetchAll,
  };
}
