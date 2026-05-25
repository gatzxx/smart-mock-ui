import { useQuery } from "@tanstack/react-query";

import { fetchMeta } from "@/api/metaApi";

const META_QUERY_KEY = "api-meta";

export function useMeta(apiBaseUrl: string) {
  return useQuery({
    queryKey: [META_QUERY_KEY, apiBaseUrl],
    queryFn: () => fetchMeta(apiBaseUrl),
  });
}
