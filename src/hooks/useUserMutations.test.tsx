import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { type ReactNode } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { useUserMutations } from "@/hooks/useUserMutations";

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
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useUserMutations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("invalidates users query after create", async () => {
    const { createUser } = await import("@/api/usersApi");
    const { toast } = await import("sonner");
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    vi.mocked(createUser).mockResolvedValue({
      id: "user-1",
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      role: "Engineer",
    });

    const { result } = renderHook(() => useUserMutations(API_BASE_URL), {
      wrapper: createWrapper(queryClient),
    });

    result.current.createMutation.mutate({
      fullName: "Ada Lovelace",
      email: "ada@example.com",
      role: "Engineer",
    });

    await waitFor(() => {
      expect(createUser).toHaveBeenCalled();
    });

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ["users", API_BASE_URL],
      refetchType: "all",
    });
    expect(toast.success).toHaveBeenCalledWith("Пользователь создан");
  });
});
