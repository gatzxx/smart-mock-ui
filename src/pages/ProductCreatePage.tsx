import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { Breadcrumbs, type BreadcrumbItem } from "@/components/Breadcrumbs";
import { ProductForm } from "@/components/ProductForm";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";
import { useFormCancelNavigation } from "@/hooks/useFormCancelNavigation";
import { useProductMutations } from "@/hooks/useProductMutations";
import type { ProductFormValues } from "@/lib/productFormSchema";

const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Товары", href: "/products" },
  { label: "Новый товар" },
];

export const ProductCreatePage = memo(function ProductCreatePage() {
  const apiBaseUrl = useApiBaseUrl();
  const navigate = useNavigate();
  const { createMutation } = useProductMutations(apiBaseUrl);
  const handleCancel = useFormCancelNavigation("/products");

  const handleSubmit = useCallback(
    (values: ProductFormValues) => {
      createMutation.mutate(values, {
        onSuccess: (createdProduct) => {
          navigate(`/products/${createdProduct.id}`);
        },
      });
    },
    [createMutation, navigate],
  );

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Breadcrumbs items={breadcrumbItems} testId="product-create-breadcrumbs" />
      <Card data-testid="product-create-page">
        <CardHeader>
          <CardTitle>Новый товар</CardTitle>
          <CardDescription>
            POST /api/products: запись попадёт в in-memory store mock API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProductForm
            isSubmitting={createMutation.isPending}
            submitLabel="Создать"
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
});
