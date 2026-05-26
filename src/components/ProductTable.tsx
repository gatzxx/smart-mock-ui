import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

import { DataTable } from "@/components/DataTable";
import { ProductRowActions } from "@/components/ProductRowActions";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";

type ProductTableProps = {
  apiBaseUrl: string;
  products: Product[];
};

export const ProductTable = memo(function ProductTable({
  apiBaseUrl,
  products,
}: ProductTableProps) {
  const getRowId = useCallback((product: Product) => product.id, []);

  const columns = useMemo<ColumnDef<Product, unknown>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Название",
        cell: ({ row }) => (
          <Link
            className="font-medium text-primary underline-offset-4 hover:underline"
            to={`/products/${row.original.id}`}
          >
            {row.original.title}
          </Link>
        ),
      },
      {
        accessorKey: "price",
        header: "Цена",
      },
      {
        accessorKey: "inStock",
        header: "Наличие",
        cell: ({ row }) => (
          <Badge variant={row.original.inStock ? "success" : "muted"}>
            {row.original.inStock ? "В наличии" : "Нет в наличии"}
          </Badge>
        ),
        sortingFn: (rowA, rowB) =>
          Number(rowB.original.inStock) - Number(rowA.original.inStock),
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Действия</span>,
        cell: ({ row }) => (
          <ProductRowActions apiBaseUrl={apiBaseUrl} product={row.original} />
        ),
      },
    ],
    [apiBaseUrl],
  );

  return (
    <DataTable
      columns={columns}
      data={products}
      getRowId={getRowId}
      testId="product-table"
    />
  );
});
