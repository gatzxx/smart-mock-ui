import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { queryKeys } from "@/constants/queryKeys";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useProductMutations } from "@/hooks/useProductMutations";
import { getListCount } from "@/lib/listQueryCache";
import { ApiAvailabilityProvider } from "@/providers/ApiAvailabilityProvider";
import type { Product } from "@/types/product";

vi.mock("@/api/productsApi", () => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
  fetchProducts: vi.fn(),
}));

vi.mock("@/api/usersApi", () => ({
  fetchUsers: vi.fn().mockResolvedValue([]),
}));

vi.mock("@/api/healthApi", () => ({
  fetchHealth: vi.fn().mockResolvedValue({
    status: "ok",
    uptime: 10,
    timestamp: "2026-05-29T10:00:00.000Z",
  }),
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
      <QueryClientProvider client={queryClient}>
        <ApiAvailabilityProvider>{children}</ApiAvailabilityProvider>
      </QueryClientProvider>
    );
  };
}

describe("CRUD list cache flow", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("adds created product to list cache immediately", async () => {
    const { createProduct } = await import("@/api/productsApi");
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const productsQueryKey = queryKeys.products.all(API_BASE_URL);

    queryClient.setQueryData<Product[]>(productsQueryKey, [
      { id: "product-0", title: "Existing", price: "10", inStock: true },
    ]);

    vi.mocked(createProduct).mockResolvedValue({
      id: "product-1",
      title: "Created Product",
      price: "29.99",
      inStock: true,
    });

    const { result } = renderHook(() => useProductMutations(API_BASE_URL), {
      wrapper: createWrapper(queryClient),
    });

    result.current.createMutation.mutate({
      title: "Created Product",
      price: 29.99,
      inStock: true,
    });

    await waitFor(() => {
      expect(result.current.createMutation.isSuccess).toBe(true);
    });

    const cachedProducts = queryClient.getQueryData<Product[]>(productsQueryKey);

    expect(cachedProducts).toHaveLength(2);
    expect(cachedProducts?.some((product) => product.id === "product-1")).toBe(true);
  });

  it("updates product in list cache after PATCH", async () => {
    const { updateProduct } = await import("@/api/productsApi");
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const productsQueryKey = queryKeys.products.all(API_BASE_URL);

    queryClient.setQueryData<Product[]>(productsQueryKey, [
      { id: "product-1", title: "Before", price: "10", inStock: true },
    ]);

    vi.mocked(updateProduct).mockResolvedValue({
      id: "product-1",
      title: "After",
      price: "15",
      inStock: false,
      description: "Updated description",
      updatedAt: "2026-05-29T10:00:00.000Z",
    });

    const { result } = renderHook(() => useProductMutations(API_BASE_URL), {
      wrapper: createWrapper(queryClient),
    });

    result.current.updateMutation.mutate({
      productId: "product-1",
      input: { title: "After", price: 15, inStock: false },
    });

    await waitFor(() => {
      expect(result.current.updateMutation.isSuccess).toBe(true);
    });

    const cachedProducts = queryClient.getQueryData<Product[]>(productsQueryKey);
    const updatedProduct = cachedProducts?.find(
      (product) => product.id === "product-1",
    );

    expect(updatedProduct?.title).toBe("After");
    expect(updatedProduct?.inStock).toBe(false);
  });

  it("reflects products count from shared list cache in dashboard stats", async () => {
    const { fetchProducts } = await import("@/api/productsApi");
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const productsQueryKey = queryKeys.products.all(API_BASE_URL);
    const mockProducts = [
      { id: "1", title: "One", price: "10", inStock: true },
      { id: "2", title: "Two", price: "20", inStock: false },
    ];

    vi.mocked(fetchProducts).mockResolvedValue(mockProducts);

    const { result } = renderHook(() => useDashboardStats(API_BASE_URL), {
      wrapper: createWrapper(queryClient),
    });

    await waitFor(() => {
      expect(result.current.productsCount).toBe(2);
    });

    expect(getListCount(queryClient, productsQueryKey)).toBe(2);
  });
});
