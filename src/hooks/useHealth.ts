import { useQuery } from "@tanstack/react-query";

import { fetchHealth } from "@/api/healthApi";
import { HEALTH_COLD_START_POLL_INTERVAL_MS } from "@/constants/apiAvailability";
import { queryKeys } from "@/constants/queryKeys";
import type { HealthStatus } from "@/types/health";

export function useHealth(apiBaseUrl: string) {
  return useQuery({
    queryKey: queryKeys.health.all(apiBaseUrl),
    queryFn: () => fetchHealth(apiBaseUrl),
    refetchOnMount: true,
    staleTime: 0,
    refetchInterval: (query) => {
      const data = query.state.data as HealthStatus | undefined;
      return data?.status === "ok" ? false : HEALTH_COLD_START_POLL_INTERVAL_MS;
    },
  });
}
