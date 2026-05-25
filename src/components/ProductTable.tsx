import { memo } from "react";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "@/types/product";

type ProductTableProps = {
  products: Product[];
};

type ProductRowProps = {
  product: Product;
};

const ProductRow = memo(function ProductRow({ product }: ProductRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{product.title}</TableCell>
      <TableCell>{product.price}</TableCell>
      <TableCell>
        <Badge variant={product.inStock ? "success" : "muted"}>
          {product.inStock ? "В наличии" : "Нет в наличии"}
        </Badge>
      </TableCell>
    </TableRow>
  );
});

export const ProductTable = memo(function ProductTable({ products }: ProductTableProps) {
  return (
    <Table data-testid="product-table">
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          <TableHead>Цена</TableHead>
          <TableHead>Наличие</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <ProductRow key={product.id} product={product} />
        ))}
      </TableBody>
    </Table>
  );
});
