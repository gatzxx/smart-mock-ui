import { Plus } from "lucide-react";
import { memo, useMemo } from "react";
import { Link } from "react-router-dom";

import { ProductTable } from "@/components/ProductTable";
import { ProductsEmpty } from "@/components/ProductsEmpty";
import { ProductsSkeleton } from "@/components/ProductsSkeleton";
import { SearchEmpty } from "@/components/SearchEmpty";
import { TableSearchField } from "@/components/TableSearchField";
import { UsersError } from "@/components/UsersError";
import { Button } from "@/components/ui/button";
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";
import { useClientSearch } from "@/hooks/useClientSearch";
import { useProducts } from "@/hooks/useProducts";
import { useRefetchWithToast } from "@/hooks/useRefetchWithToast";
import type { Product } from "@/types/product";

const PRODUCTS_SEARCH_PLACEHOLDER = "Поиск по названию или цене";

function getProductSearchText(product: Product): string {
  const stockLabel = product.inStock ? "в наличии" : "нет в наличии";
  return `${product.title} ${product.price} ${stockLabel}`;
}

export const ProductsPage = memo(function ProductsPage() {
  const apiBaseUrl = useApiBaseUrl();
  const { data, isPending, isError, error, refetch } = useProducts(apiBaseUrl);

  const { query, setQuery, filteredItems } = useClientSearch(
    data ?? [],
    getProductSearchText,
  );

  const handleRetry = useRefetchWithToast(refetch);

  const errorMessage = useMemo(() => {
    if (error instanceof Error) {
      return error.message;
    }

    return "Не удалось загрузить данные";
  }, [error]);

  const pageHeader = (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Товары</h2>
        <p className="text-sm text-muted-foreground">
          CRUD demo: создание, редактирование и удаление через mock API
        </p>
      </div>
      <Button asChild>
        <Link to="/products/new">
          <Plus aria-hidden="true" className="size-4" />
          Товар
        </Link>
      </Button>
    </div>
  );

  if (isPending) {
    return (
      <div>
        {pageHeader}
        <ProductsSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        {pageHeader}
        <UsersError message={errorMessage} onRetry={handleRetry} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div>
        {pageHeader}
        <ProductsEmpty />
      </div>
    );
  }

  return (
    <div>
      {pageHeader}
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
        <ProductTable apiBaseUrl={apiBaseUrl} products={filteredItems} />
      )}
    </div>
  );
});
