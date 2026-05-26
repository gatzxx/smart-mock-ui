import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useProductMutations } from "@/hooks/useProductMutations";

vi.mock("@/api/productsApi", () => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

const API_BASE_URL = "http://localhost:3000";

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useProductMutations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("invalidates products query after create", async () => {
    const { createProduct } = await import("@/api/productsApi");
    const { toast } = await import("sonner");
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    vi.mocked(createProduct).mockResolvedValue({
      id: "product-1",
      title: "Wireless Mouse",
      price: "29.99",
      inStock: true,
    });

    const { result } = renderHook(() => useProductMutations(API_BASE_URL), {
      wrapper: createWrapper(queryClient),
    });

    result.current.createMutation.mutate({
      title: "Wireless Mouse",
      price: 29.99,
      inStock: true,
    });

    await waitFor(() => {
      expect(createProduct).toHaveBeenCalled();
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["products", API_BASE_URL],
    });
    expect(toast.success).toHaveBeenCalledWith("Товар создан");
  });
});
