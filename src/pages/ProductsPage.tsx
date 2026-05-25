import { memo, useCallback, useMemo } from "react";

import { ProductTable } from "@/components/ProductTable";
import { ProductsEmpty } from "@/components/ProductsEmpty";
import { ProductsSkeleton } from "@/components/ProductsSkeleton";
import { SearchEmpty } from "@/components/SearchEmpty";
import { TableSearchField } from "@/components/TableSearchField";
import { UsersError } from "@/components/UsersError";
import { useClientSearch } from "@/hooks/useClientSearch";
import { useProducts } from "@/hooks/useProducts";
import type { Product } from "@/types/product";

const PRODUCTS_SEARCH_PLACEHOLDER = "Поиск по названию или цене";

function getProductSearchText(product: Product): string {
  const stockLabel = product.inStock ? "в наличии" : "нет в наличии";
  return `${product.title} ${product.price} ${stockLabel}`;
}

export const ProductsPage = memo(function ProductsPage() {
  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    [],
  );

  const { data, isPending, isError, error, refetch } = useProducts(apiBaseUrl);

  const { query, setQuery, filteredItems } = useClientSearch(
    data ?? [],
    getProductSearchText,
  );

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

  return (
    <div>
      <TableSearchField
        placeholder={PRODUCTS_SEARCH_PLACEHOLDER}
        testId="products-search"
        value={query}
        onChange={setQuery}
      />
      {filteredItems.length === 0 ? (
        <SearchEmpty
          description="Попробуйте изменить запрос."
          testId="products-search-empty"
          title="Ничего не найдено"
        />
      ) : (
        <ProductTable products={filteredItems} />
      )}
    </div>
  );
});
