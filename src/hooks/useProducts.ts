import { useQuery } from "@tanstack/react-query";

import { fetchProducts } from "@/api/productsApi";

const PRODUCTS_QUERY_KEY = "products";

export function useProducts(apiBaseUrl: string) {
  return useQuery({
    queryKey: [PRODUCTS_QUERY_KEY, apiBaseUrl],
    queryFn: () => fetchProducts(apiBaseUrl),
  });
}
