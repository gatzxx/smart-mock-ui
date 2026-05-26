import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

import { DataTable } from "@/components/DataTable";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";

type ProductTableProps = {
  products: Product[];
};

export const ProductTable = memo(function ProductTable({ products }: ProductTableProps) {
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
    ],
    [],
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
