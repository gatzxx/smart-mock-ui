import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TABLE_PAGE_SIZE } from "@/constants/table";

type DataTableProps<TData> = {
  caption: string;
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  getRowId?: (row: TData) => string;
  testId: string;
  pageSize?: number;
};

type SortableHeader = {
  column: {
    columnDef: {
      header?: unknown;
    };
    id: string;
  };
};

function getColumnHeaderLabel(header: SortableHeader): string {
  const headerDefinition = header.column.columnDef.header;

  if (typeof headerDefinition === "string") {
    return headerDefinition;
  }

  return header.column.id;
}

function DataTableInner<TData>({
  caption,
  columns,
  data,
  getRowId,
  testId,
  pageSize = TABLE_PAGE_SIZE,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getRowId,
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();

  const handlePreviousPage = useCallback(() => {
    table.previousPage();
  }, [table]);

  const handleNextPage = useCallback(() => {
    table.nextPage();
  }, [table]);

  const headerGroups = table.getHeaderGroups().map((headerGroup) => (
    <TableRow key={headerGroup.id}>
      {headerGroup.headers.map((header) => {
        const canSort = header.column.getCanSort();
        const sortDirection = header.column.getIsSorted();
        const headerLabel = getColumnHeaderLabel(header);

        return (
          <TableHead key={header.id} scope="col">
            {header.isPlaceholder ? null : canSort ? (
              <button
                aria-label={`Сортировать: ${headerLabel}`}
                className="inline-flex items-center gap-1 font-medium text-muted-foreground hover:text-foreground"
                type="button"
                onClick={header.column.getToggleSortingHandler()}
              >
                {flexRender(header.column.columnDef.header, header.getContext())}
                {sortDirection === "asc" ? (
                  <ArrowUp aria-hidden="true" className="size-3.5" />
                ) : sortDirection === "desc" ? (
                  <ArrowDown aria-hidden="true" className="size-3.5" />
                ) : (
                  <ArrowUpDown aria-hidden="true" className="size-3.5 opacity-60" />
                )}
              </button>
            ) : (
              flexRender(header.column.columnDef.header, header.getContext())
            )}
          </TableHead>
        );
      })}
    </TableRow>
  ));

  const rows = table.getRowModel().rows.map((row) => (
    <TableRow key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  ));

  const paginationLabel = useMemo(
    () => `Страница ${pageIndex + 1} из ${Math.max(pageCount, 1)}`,
    [pageCount, pageIndex],
  );

  return (
    <div className="space-y-4">
      <Table data-testid={testId}>
        <caption className="sr-only">{caption}</caption>
        <TableHeader>{headerGroups}</TableHeader>
        <TableBody>{rows}</TableBody>
      </Table>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          className="text-sm text-muted-foreground"
          data-testid={`${testId}-pagination-label`}
        >
          {paginationLabel}
        </p>
        <div className="flex gap-2">
          <Button
            aria-label="Предыдущая страница"
            disabled={!table.getCanPreviousPage()}
            size="sm"
            type="button"
            variant="outline"
            onClick={handlePreviousPage}
          >
            Назад
          </Button>
          <Button
            aria-label="Следующая страница"
            disabled={!table.getCanNextPage()}
            size="sm"
            type="button"
            variant="outline"
            onClick={handleNextPage}
          >
            Вперёд
          </Button>
        </div>
      </div>
    </div>
  );
}

export const DataTable = memo(DataTableInner) as typeof DataTableInner;
