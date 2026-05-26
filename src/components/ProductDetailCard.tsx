import { ArrowLeft } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProductDetail } from "@/types/productDetail";

type ProductDetailCardProps = {
  product: ProductDetail;
};

export const ProductDetailCard = memo(function ProductDetailCard({
  product,
}: ProductDetailCardProps) {
  return (
    <Card data-testid="product-detail-card">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1">
          <CardTitle>{product.title}</CardTitle>
          <CardDescription>{product.price}</CardDescription>
        </div>
        <Badge variant={product.inStock ? "success" : "muted"}>
          {product.inStock ? "В наличии" : "Нет в наличии"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-3 text-sm sm:grid-cols-[120px_1fr]">
          <dt className="text-muted-foreground">ID</dt>
          <dd className="truncate font-mono text-xs">{product.id}</dd>
          <dt className="text-muted-foreground">Обновлён</dt>
          <dd>{product.updatedAt}</dd>
        </dl>
        <div>
          <p className="mb-1 text-sm font-medium text-muted-foreground">Описание</p>
          <p className="text-sm leading-relaxed">{product.description}</p>
        </div>
        <Button asChild className="mt-2" variant="outline">
          <Link to="/products">
            <ArrowLeft aria-hidden="true" className="size-4" />
            К списку
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
});
