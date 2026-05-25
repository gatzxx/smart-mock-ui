import { memo, useCallback, useMemo } from "react";

import { ProductTable } from "@/components/ProductTable";
import { ProductsEmpty } from "@/components/ProductsEmpty";
import { ProductsSkeleton } from "@/components/ProductsSkeleton";
import { UsersError } from "@/components/UsersError";
import { useProducts } from "@/hooks/useProducts";

export const ProductsPage = memo(function ProductsPage() {
  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    [],
  );

  const { data, isPending, isError, error, refetch } = useProducts(apiBaseUrl);

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const errorMessage = useMemo(() => {
    if (error instanceof Error) {
      return error.message;
    }
    return "Не удалось загрузить данные";
  }, [error]);

  if (isPending) {
    return <ProductsSkeleton />;
  }

  if (isError) {
    return <UsersError message={errorMessage} onRetry={handleRetry} />;
  }

  if (!data || data.length === 0) {
    return <ProductsEmpty />;
  }

  return <ProductTable products={data} />;
});
