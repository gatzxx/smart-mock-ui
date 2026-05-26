import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { ProductTable } from "@/components/ProductTable";
import type { Product } from "@/types/product";

const mockProducts: Product[] = [
  {
    id: "1",
    title: "Wireless Mouse",
    price: "$29.99",
    inStock: true,
  },
  {
    id: "2",
    title: "USB Hub",
    price: "$19.50",
    inStock: false,
  },
];

const API_BASE_URL = "http://localhost:3000";

function renderProductTable() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <ProductTable apiBaseUrl={API_BASE_URL} products={mockProducts} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("ProductTable", () => {
  it("renders product list with stock badges and detail links", () => {
    renderProductTable();

    expect(screen.getByTestId("product-table")).toBeInTheDocument();
    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("В наличии")).toBeInTheDocument();
    expect(screen.getByText("USB Hub")).toBeInTheDocument();
    expect(screen.getByText("Нет в наличии")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Wireless Mouse" })).toHaveAttribute(
      "href",
      "/products/1",
    );
  });
});
