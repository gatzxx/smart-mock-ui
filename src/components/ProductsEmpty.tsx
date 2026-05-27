import { memo } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const ProductsEmpty = memo(function ProductsEmpty() {
  return (
    <Card data-testid="products-empty">
      <CardHeader className="text-center">
        <CardTitle>Товары не найдены</CardTitle>
        <CardDescription>API вернул пустой список.</CardDescription>
      </CardHeader>
    </Card>
  );
});
