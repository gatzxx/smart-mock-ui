import { render, screen } from "@testing-library/react";
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

describe("ProductTable", () => {
  it("renders product list with stock badges", () => {
    render(<ProductTable products={mockProducts} />);

    expect(screen.getByTestId("product-table")).toBeInTheDocument();
    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("In stock")).toBeInTheDocument();
    expect(screen.getByText("USB Hub")).toBeInTheDocument();
    expect(screen.getByText("Out of stock")).toBeInTheDocument();
  });
});
