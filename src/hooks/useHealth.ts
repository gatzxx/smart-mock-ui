import { useQuery } from "@tanstack/react-query";

import { fetchHealth } from "@/api/healthApi";

const HEALTH_QUERY_KEY = "health";

export function useHealth(apiBaseUrl: string) {
  return useQuery({
    queryKey: [HEALTH_QUERY_KEY, apiBaseUrl],
    queryFn: () => fetchHealth(apiBaseUrl),
  });
}
