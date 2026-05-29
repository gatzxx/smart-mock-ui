import { useQuery } from "@tanstack/react-query";

import { fetchProducts } from "@/api/productsApi";
import { queryKeys } from "@/constants/queryKeys";

type UseProductsOptions = {
  enabled?: boolean;
};

export function useProducts(apiBaseUrl: string, options?: UseProductsOptions) {
  return useQuery({
    queryKey: queryKeys.products.all(apiBaseUrl),
    queryFn: () => fetchProducts(apiBaseUrl),
    enabled: options?.enabled ?? true,
    refetchOnMount: true,
  });
}
