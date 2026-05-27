import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { queryKeys } from "@/constants/queryKeys";
import { useProductMutations } from "@/hooks/useProductMutations";
import { useUserMutations } from "@/hooks/useUserMutations";
import type { Product } from "@/types/product";
import type { User } from "@/types/user";

vi.mock("@/api/productsApi", () => ({
  createProduct: vi.fn(),
  updateProduct: vi.fn(),
  deleteProduct: vi.fn(),
}));

vi.mock("@/api/usersApi", () => ({
  createUser: vi.fn(),
  updateUser: vi.fn(),
  deleteUser: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

const API_BASE_URL = "http://localhost:3000";

function createWrapper(queryClient: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
}

describe("mutation list sync", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("syncs user create and update in list cache", async () => {
    const { createUser, updateUser } = await import("@/api/usersApi");
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const usersQueryKey = queryKeys.users.all(API_BASE_URL);

    queryClient.setQueryData<User[]>(usersQueryKey, [
      {
        id: "user-0",
        fullName: "Existing User",
        email: "existing@example.com",
        role: "QA",
      },
    ]);

    vi.mocked(createUser).mockResolvedValue({
      id: "user-1",
      fullName: "Created User",
      email: "created@example.com",
      role: "Engineer",
    });

    vi.mocked(updateUser).mockResolvedValue({
      id: "user-1",
      fullName: "Updated User",
      email: "created@example.com",
      role: "Lead",
      phone: "+1 555 0100",
      avatar: "https://example.com/avatar.jpg",
      bio: "Updated bio",
    });

    const { result } = renderHook(() => useUserMutations(API_BASE_URL), {
      wrapper: createWrapper(queryClient),
    });

    result.current.createMutation.mutate({
      fullName: "Created User",
      email: "created@example.com",
      role: "Engineer",
    });

    await waitFor(() => {
      expect(result.current.createMutation.isSuccess).toBe(true);
    });

    let cachedUsers = queryClient.getQueryData<User[]>(usersQueryKey);
    expect(cachedUsers).toHaveLength(2);
    expect(cachedUsers?.some((user) => user.id === "user-1")).toBe(true);

    result.current.updateMutation.mutate({
      userId: "user-1",
      input: {
        fullName: "Updated User",
        email: "created@example.com",
        role: "Lead",
      },
    });

    await waitFor(() => {
      expect(result.current.updateMutation.isSuccess).toBe(true);
    });

    cachedUsers = queryClient.getQueryData<User[]>(usersQueryKey);
    const updatedUser = cachedUsers?.find((user) => user.id === "user-1");

    expect(updatedUser?.fullName).toBe("Updated User");
    expect(updatedUser?.role).toBe("Lead");
  });

  it("removes deleted product from list cache", async () => {
    const { deleteProduct } = await import("@/api/productsApi");
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const productsQueryKey = queryKeys.products.all(API_BASE_URL);

    queryClient.setQueryData<Product[]>(productsQueryKey, [
      { id: "product-1", title: "Keep", price: "10", inStock: true },
      { id: "product-2", title: "Delete me", price: "20", inStock: false },
    ]);

    vi.mocked(deleteProduct).mockResolvedValue(undefined);

    const { result } = renderHook(() => useProductMutations(API_BASE_URL), {
      wrapper: createWrapper(queryClient),
    });

    result.current.deleteMutation.mutate("product-2");

    await waitFor(() => {
      expect(result.current.deleteMutation.isSuccess).toBe(true);
    });

    const cachedProducts = queryClient.getQueryData<Product[]>(productsQueryKey);

    expect(cachedProducts).toHaveLength(1);
    expect(cachedProducts?.[0]?.id).toBe("product-1");
  });

  it("removes deleted user from list cache", async () => {
    const { deleteUser } = await import("@/api/usersApi");
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const usersQueryKey = queryKeys.users.all(API_BASE_URL);

    queryClient.setQueryData<User[]>(usersQueryKey, [
      { id: "user-1", fullName: "Keep", email: "keep@example.com", role: "QA" },
      { id: "user-2", fullName: "Delete me", email: "delete@example.com", role: "Dev" },
    ]);

    vi.mocked(deleteUser).mockResolvedValue(undefined);

    const { result } = renderHook(() => useUserMutations(API_BASE_URL), {
      wrapper: createWrapper(queryClient),
    });

    result.current.deleteMutation.mutate("user-2");

    await waitFor(() => {
      expect(result.current.deleteMutation.isSuccess).toBe(true);
    });

    const cachedUsers = queryClient.getQueryData<User[]>(usersQueryKey);

    expect(cachedUsers).toHaveLength(1);
    expect(cachedUsers?.[0]?.id).toBe("user-1");
  });
});
