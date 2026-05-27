import type { ColumnDef } from "@tanstack/react-table";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { DataTable } from "@/components/DataTable";
import { TABLE_PAGE_SIZE } from "@/constants/table";

type Row = {
  id: string;
  name: string;
};

const mockRows: Row[] = Array.from({ length: 6 }, (_, index) => ({
  id: String(index + 1),
  name: `Item ${index + 1}`,
}));

const columns: ColumnDef<Row, unknown>[] = [
  {
    accessorKey: "name",
    header: "Название",
  },
];

describe("DataTable", () => {
  afterEach(() => {
    cleanup();
  });

  it("paginates rows using the default page size", () => {
    render(
      <DataTable
        caption="Тестовая таблица"
        columns={columns}
        data={mockRows}
        testId="data-table"
      />,
    );

    expect(screen.getByText("Item 1")).toBeInTheDocument();
    expect(screen.getByText(`Item ${TABLE_PAGE_SIZE}`)).toBeInTheDocument();
    expect(screen.queryByText(`Item ${TABLE_PAGE_SIZE + 1}`)).not.toBeInTheDocument();
    expect(screen.getByTestId("data-table-pagination-label")).toHaveTextContent(
      "Страница 1 из 2",
    );

    fireEvent.click(screen.getByRole("button", { name: "Следующая страница" }));

    expect(screen.getByText(`Item ${TABLE_PAGE_SIZE + 1}`)).toBeInTheDocument();
    expect(screen.getByTestId("data-table-pagination-label")).toHaveTextContent(
      "Страница 2 из 2",
    );
  });

  it("sorts rows when header is clicked", () => {
    const rows: Row[] = [
      { id: "1", name: "Bravo" },
      { id: "2", name: "Alpha" },
    ];

    render(
      <DataTable
        caption="Сортируемая таблица"
        columns={columns}
        data={rows}
        pageSize={10}
        testId="sortable-table"
      />,
    );

    const table = screen.getByTestId("sortable-table");
    const sortButton = within(table).getByRole("button", { name: /Название/i });

    fireEvent.click(sortButton);

    const cells = within(table).getAllByRole("cell");
    expect(cells[0]).toHaveTextContent("Alpha");
    expect(cells[1]).toHaveTextContent("Bravo");
  });

  it("exposes table caption and column scope for assistive tech", () => {
    render(
      <DataTable
        caption="Тестовая таблица"
        columns={columns}
        data={mockRows.slice(0, 1)}
        testId="accessible-table"
      />,
    );

    expect(screen.getByText("Тестовая таблица")).toHaveClass("sr-only");
    expect(screen.getByRole("columnheader", { name: "Название" })).toHaveAttribute(
      "scope",
      "col",
    );
  });
});
