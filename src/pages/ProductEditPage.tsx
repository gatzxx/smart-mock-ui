import { memo, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Breadcrumbs, type BreadcrumbItem } from "@/components/Breadcrumbs";
import { ProductDetailSkeleton } from "@/components/ProductDetailSkeleton";
import { ProductForm } from "@/components/ProductForm";
import { UsersError } from "@/components/UsersError";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";
import { useProduct } from "@/hooks/useProduct";
import { useProductMutations } from "@/hooks/useProductMutations";
import { useRefetchWithToast } from "@/hooks/useRefetchWithToast";
import {
  parseProductPrice,
  type ProductFormValues,
} from "@/lib/productFormSchema";

export const ProductEditPage = memo(function ProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const apiBaseUrl = useApiBaseUrl();
  const navigate = useNavigate();
  const { data, isPending, isError, error, refetch } = useProduct(apiBaseUrl, id);
  const { updateMutation } = useProductMutations(apiBaseUrl);

  const handleRetry = useRefetchWithToast(refetch);

  const errorMessage = useMemo(() => {
    if (error instanceof Error) {
      return error.message;
    }

    return "Не удалось загрузить данные";
  }, [error]);

  const breadcrumbItems = useMemo((): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [{ label: "Товары", href: "/products" }];

    if (data) {
      items.push({ label: data.title, href: `/products/${data.id}` });
    } else {
      items.push({ label: id ?? "Product" });
    }

    items.push({ label: "Редактирование" });
    return items;
  }, [data, id]);

  const defaultValues = useMemo((): ProductFormValues | undefined => {
    if (!data) {
      return undefined;
    }

    return {
      title: data.title,
      price: parseProductPrice(data.price),
      inStock: data.inStock,
    };
  }, [data]);

  const handleSubmit = useCallback(
    (values: ProductFormValues) => {
      if (!id) {
        return;
      }

      updateMutation.mutate(
        { productId: id, input: values },
        {
          onSuccess: (updatedProduct) => {
            navigate(`/products/${updatedProduct.id}`);
          },
        },
      );
    },
    [id, navigate, updateMutation],
  );

  const breadcrumbNav = (
    <Breadcrumbs items={breadcrumbItems} testId="product-edit-breadcrumbs" />
  );

  if (!id) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        {breadcrumbNav}
        <Card data-testid="product-edit-not-found">
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
      <div className="mx-auto max-w-xl space-y-4">
        {breadcrumbNav}
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (isError) {
    const isNotFound = errorMessage.includes("не найден");

    if (isNotFound) {
      return (
        <div className="mx-auto max-w-xl space-y-4">
          {breadcrumbNav}
          <Card data-testid="product-edit-not-found">
            <CardHeader className="text-center">
              <CardTitle>Товар не найден</CardTitle>
              <CardDescription>Запись с id {id} недоступна.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-xl space-y-4">
        {breadcrumbNav}
        <UsersError message={errorMessage} onRetry={handleRetry} />
      </div>
    );
  }

  if (!data || !defaultValues) {
    return null;
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      {breadcrumbNav}
      <Card data-testid="product-edit-page">
        <CardHeader>
          <CardTitle>Редактирование</CardTitle>
          <CardDescription>
            PATCH /api/products/{id}: изменения сохраняются в store mock API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm
            defaultValues={defaultValues}
            isSubmitting={updateMutation.isPending}
            submitLabel="Сохранить"
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
});
