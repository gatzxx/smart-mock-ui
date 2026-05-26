import { memo, useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useProductMutations } from "@/hooks/useProductMutations";
import type { Product } from "@/types/product";

type ProductRowActionsProps = {
  apiBaseUrl: string;
  product: Product;
};

export const ProductRowActions = memo(function ProductRowActions({
  apiBaseUrl,
  product,
}: ProductRowActionsProps) {
  const { deleteMutation } = useProductMutations(apiBaseUrl);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = useCallback(() => {
    setIsConfirmOpen(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmOpen(false);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteMutation.mutate(product.id, {
      onSettled: () => {
        setIsConfirmOpen(false);
      },
    });
  }, [deleteMutation, product.id]);

  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild size="sm" variant="outline">
        <Link to={`/products/${product.id}/edit`}>Изменить</Link>
      </Button>
      {isConfirmOpen ? (
        <div className="flex items-center gap-1">
          <Button
            disabled={deleteMutation.isPending}
            size="sm"
            variant="outline"
            onClick={handleConfirmDelete}
          >
            {deleteMutation.isPending ? "..." : "Да"}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancelDelete}>
            Нет
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="ghost" onClick={handleDeleteClick}>
          Удалить
        </Button>
      )}
    </div>
  );
});
