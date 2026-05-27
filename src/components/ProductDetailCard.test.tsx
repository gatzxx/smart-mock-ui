import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { ProductDetailCard } from "@/components/ProductDetailCard";
import type { ProductDetail } from "@/types/productDetail";

const mockProduct: ProductDetail = {
  id: "product-1",
  title: "Wireless Mouse",
  price: "$29.99",
  inStock: true,
  description: "Ergonomic mouse for daily work.",
  updatedAt: "2026-05-29T12:00:00.000Z",
};

describe("ProductDetailCard", () => {
  it("renders product detail fields", () => {
    render(
      <MemoryRouter>
        <ProductDetailCard product={mockProduct} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("product-detail-card")).toBeInTheDocument();
    expect(screen.getByText("Wireless Mouse")).toBeInTheDocument();
    expect(screen.getByText("$29.99")).toBeInTheDocument();
    expect(screen.getByText("Ergonomic mouse for daily work.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /К списку/i })).toHaveAttribute(
      "href",
      "/products",
    );
  });
});
