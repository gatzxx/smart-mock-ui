import { memo, useMemo } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const SKELETON_ROW_COUNT = 5;

export const ProductsSkeleton = memo(function ProductsSkeleton() {
  const rows = useMemo(
    () =>
      Array.from({ length: SKELETON_ROW_COUNT }, (_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-40" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-5 w-24 rounded-full" />
          </TableCell>
        </TableRow>
      )),
    [],
  );

  return (
    <Table data-testid="products-skeleton">
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          <TableHead>Цена</TableHead>
          <TableHead>Наличие</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>{rows}</TableBody>
    </Table>
  );
});
