import { useQuery } from "@tanstack/react-query";

import { fetchHealth } from "@/api/healthApi";
import { queryKeys } from "@/constants/queryKeys";

export function useHealth(apiBaseUrl: string) {
  return useQuery({
    queryKey: queryKeys.health.all(apiBaseUrl),
    queryFn: () => fetchHealth(apiBaseUrl),
    refetchOnMount: true,
  });
}
