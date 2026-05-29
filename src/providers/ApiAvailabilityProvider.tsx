import {
  createContext,
  memo,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import {
  resolveApiAvailability,
  type ApiAvailabilityStatus,
} from "@/constants/apiAvailability";
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";
import { useHealth } from "@/hooks/useHealth";
import type { RefetchFn } from "@/hooks/useRefetchWithToast";
import type { HealthStatus } from "@/types/health";

type ApiAvailabilityContextValue = {
  healthData: HealthStatus | undefined;
  isApiReady: boolean;
  isApiWaking: boolean;
  isFetching: boolean;
  refetch: RefetchFn;
  status: ApiAvailabilityStatus;
};

const ApiAvailabilityContext = createContext<ApiAvailabilityContextValue | null>(null);

type ApiAvailabilityProviderProps = {
  children: ReactNode;
};

export const ApiAvailabilityProvider = memo(function ApiAvailabilityProvider({
  children,
}: ApiAvailabilityProviderProps) {
  const apiBaseUrl = useApiBaseUrl();
  const healthQuery = useHealth(apiBaseUrl);

  const status = useMemo(
    () =>
      resolveApiAvailability({
        data: healthQuery.data,
        failureCount: healthQuery.failureCount,
        isError: healthQuery.isError,
        isFetching: healthQuery.isFetching,
        isPending: healthQuery.isPending,
      }),
    [
      healthQuery.data,
      healthQuery.failureCount,
      healthQuery.isError,
      healthQuery.isFetching,
      healthQuery.isPending,
    ],
  );

  const refetch = useCallback<RefetchFn>(async () => {
    const result = await healthQuery.refetch();
    return { isSuccess: result.isSuccess };
  }, [healthQuery]);

  const value = useMemo(
    (): ApiAvailabilityContextValue => ({
      healthData: healthQuery.data,
      isApiReady: status === "online",
      isApiWaking: status === "checking" || status === "waking",
      isFetching: healthQuery.isFetching,
      refetch,
      status,
    }),
    [healthQuery.data, healthQuery.isFetching, refetch, status],
  );

  return (
    <ApiAvailabilityContext.Provider value={value}>
      {children}
    </ApiAvailabilityContext.Provider>
  );
});

export function useApiAvailability(): ApiAvailabilityContextValue {
  const context = useContext(ApiAvailabilityContext);

  if (!context) {
    throw new Error("useApiAvailability must be used within ApiAvailabilityProvider");
  }

  return context;
}
