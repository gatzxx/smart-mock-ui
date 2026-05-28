import {
  memo,
  type HTMLAttributes,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from "react";

import { cn } from "@/lib/utils";

export const Table = memo(function Table({
  className,
  containerClassName,
  ...props
}: HTMLAttributes<HTMLTableElement> & {
  containerClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-x-auto rounded-lg border border-border",
        containerClassName,
      )}
    >
      <table
        className={cn(
          "w-full caption-bottom text-xs md:text-sm md:min-w-0 md:w-full max-md:min-w-full max-md:w-max",
          className,
        )}
        data-slot="table"
        {...props}
      />
    </div>
  );
});

export const TableHeader = memo(function TableHeader({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("[&_tr]:border-b", className)}
      data-slot="table-header"
      {...props}
    />
  );
});

export const TableBody = memo(function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tbody
      className={cn("[&_tr:last-child]:border-0", className)}
      data-slot="table-body"
      {...props}
    />
  );
});

export const TableRow = memo(function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn("border-b border-border hover:bg-muted/50", className)}
      data-slot="table-row"
      {...props}
    />
  );
});

export const TableHead = memo(function TableHead({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-8 px-2 text-left align-middle text-xs font-medium whitespace-nowrap text-muted-foreground md:h-10 md:px-4 md:text-sm",
        className,
      )}
      data-slot="table-head"
      {...props}
    />
  );
});

export const TableCell = memo(function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn(
        "px-2 py-2 align-middle text-xs whitespace-nowrap md:px-4 md:py-3 md:text-sm",
        className,
      )}
      data-slot="table-cell"
      {...props}
    />
  );
});
