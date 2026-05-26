import { useQuery } from "@tanstack/react-query";

import { fetchProduct } from "@/api/productsApi";

const PRODUCT_DETAIL_QUERY_KEY = "product-detail";

export function useProduct(apiBaseUrl: string, productId: string | undefined) {
  return useQuery({
    queryKey: [PRODUCT_DETAIL_QUERY_KEY, apiBaseUrl, productId],
    queryFn: () => {
      if (!productId) {
        throw new Error("Товар не найден");
      }
      return fetchProduct(apiBaseUrl, productId);
    },
    enabled: Boolean(productId),
  });
}
