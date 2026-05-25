import { memo } from "react";

export const ProductsPlaceholderPage = memo(function ProductsPlaceholderPage() {
  return (
    <section
      className="rounded-lg border border-border bg-card p-8 text-center shadow-sm"
      data-testid="products-placeholder"
    >
      <h2 className="text-lg font-semibold">Products</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Placeholder for Wave 3. API endpoint{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /api/products</code>{" "}
        is already available.
      </p>
    </section>
  );
});
