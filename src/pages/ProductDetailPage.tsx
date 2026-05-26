import { memo, useMemo } from "react";
import { useParams } from "react-router-dom";

import { Breadcrumbs, type BreadcrumbItem } from "@/components/Breadcrumbs";
import { ProductDetailCard } from "@/components/ProductDetailCard";
import { ProductDetailSkeleton } from "@/components/ProductDetailSkeleton";
import { UsersError } from "@/components/UsersError";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";
import { useProduct } from "@/hooks/useProduct";
import { useRefetchWithToast } from "@/hooks/useRefetchWithToast";

export const ProductDetailPage = memo(function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const apiBaseUrl = useApiBaseUrl();

  const { data, isPending, isError, error, refetch } = useProduct(apiBaseUrl, id);

  const handleRetry = useRefetchWithToast(refetch);

  const errorMessage = useMemo(() => {
    if (error instanceof Error) {
      return error.message;
    }
    return "Не удалось загрузить данные";
  }, [error]);

  const breadcrumbItems = useMemo((): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [{ label: "Товары", href: "/products" }];

    if (isPending) {
      items.push({ label: "Загрузка..." });
      return items;
    }

    if (data) {
      items.push({ label: data.title });
      return items;
    }

    items.push({ label: id ?? "Product" });
    return items;
  }, [data, id, isPending]);

  const breadcrumbNav = (
    <Breadcrumbs items={breadcrumbItems} testId="product-detail-breadcrumbs" />
  );

  if (!id) {
    return (
      <div>
        {breadcrumbNav}
        <Card data-testid="product-detail-not-found">
          <CardHeader className="text-center">
            <CardTitle>Товар не найден</CardTitle>
            <CardDescription>Некорректный идентификатор в URL.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isPending) {
    return (
      <div>
        {breadcrumbNav}
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (isError) {
    const isNotFound = errorMessage.includes("не найден");

    if (isNotFound) {
      return (
        <div>
          {breadcrumbNav}
          <Card data-testid="product-detail-not-found">
            <CardHeader className="text-center">
              <CardTitle>Товар не найден</CardTitle>
              <CardDescription>Запись с id {id} недоступна.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }

    return (
      <div>
        {breadcrumbNav}
        <UsersError message={errorMessage} onRetry={handleRetry} />
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        {breadcrumbNav}
        <Card data-testid="product-detail-not-found">
          <CardHeader className="text-center">
            <CardTitle>Товар не найден</CardTitle>
            <CardDescription>Данные отсутствуют.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {breadcrumbNav}
      <ProductDetailCard product={data} />
    </div>
  );
});
