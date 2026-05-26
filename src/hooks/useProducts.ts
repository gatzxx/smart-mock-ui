import { useQuery } from "@tanstack/react-query";

import { fetchProducts } from "@/api/productsApi";
import { queryKeys } from "@/constants/queryKeys";

export function useProducts(apiBaseUrl: string) {
  return useQuery({
    queryKey: queryKeys.products.all(apiBaseUrl),
    queryFn: () => fetchProducts(apiBaseUrl),
  });
}
