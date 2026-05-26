import { useQuery } from "@tanstack/react-query";

import { fetchProduct } from "@/api/productsApi";
import { queryKeys } from "@/constants/queryKeys";

export function useProduct(apiBaseUrl: string, productId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.products.detail(apiBaseUrl, productId ?? ""),
    queryFn: () => {
      if (!productId) {
        throw new Error("Товар не найден");
      }

      return fetchProduct(apiBaseUrl, productId);
    },
    enabled: Boolean(productId),
  });
}
