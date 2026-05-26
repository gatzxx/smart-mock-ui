import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { REFETCH_SUCCESS_TOAST_MESSAGE } from "@/constants/theme";
import { useRefetchWithToast } from "@/hooks/useRefetchWithToast";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe("useRefetchWithToast", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows success toast after successful refetch", async () => {
    const { toast } = await import("sonner");
    const refetch = vi.fn().mockResolvedValue({ isSuccess: true });

    const { result } = renderHook(() => useRefetchWithToast(refetch));

    await result.current();

    expect(refetch).toHaveBeenCalledTimes(1);
    expect(toast.success).toHaveBeenCalledWith(REFETCH_SUCCESS_TOAST_MESSAGE);
  });

  it("does not show toast when refetch fails", async () => {
    const { toast } = await import("sonner");
    const refetch = vi.fn().mockResolvedValue({ isSuccess: false });

    const { result } = renderHook(() => useRefetchWithToast(refetch));

    await result.current();

    expect(toast.success).not.toHaveBeenCalled();
  });
});
