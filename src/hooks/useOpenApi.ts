import { useQuery } from "@tanstack/react-query";

import { fetchOpenApiSpec } from "@/api/openapiApi";

const OPENAPI_QUERY_KEY = "openapi-spec";

export function useOpenApi(
  apiBaseUrl: string,
  openapiPath: string | undefined,
  enabled: boolean,
) {
  return useQuery({
    queryKey: [OPENAPI_QUERY_KEY, apiBaseUrl, openapiPath],
    queryFn: () => {
      if (!openapiPath) {
        throw new Error("OpenAPI path is not configured");
      }

      return fetchOpenApiSpec(apiBaseUrl, openapiPath);
    },
    enabled: enabled && Boolean(openapiPath),
  });
}
