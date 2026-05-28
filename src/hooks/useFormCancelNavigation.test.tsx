import { renderHook } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";

import { useFormCancelNavigation } from "@/hooks/useFormCancelNavigation";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>("react-router-dom");

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("useFormCancelNavigation", () => {
  it("navigates back when history entry exists", () => {
    navigateMock.mockReset();

    renderHook(() => useFormCancelNavigation("/products"), {
      wrapper: ({ children }) => (
        <MemoryRouter
          initialEntries={["/products", "/products/1/edit"]}
          initialIndex={1}
        >
          <Routes>
            <Route element={children} path="/products/:id/edit" />
          </Routes>
        </MemoryRouter>
      ),
    }).result.current();

    expect(navigateMock).toHaveBeenCalledWith(-1);
  });

  it("uses fallback href on initial entry", () => {
    navigateMock.mockReset();

    renderHook(() => useFormCancelNavigation("/products"), {
      wrapper: ({ children }) => (
        <MemoryRouter initialEntries={["/products/1/edit"]}>
          <Routes>
            <Route element={children} path="/products/:id/edit" />
          </Routes>
        </MemoryRouter>
      ),
    }).result.current();

    expect(navigateMock).toHaveBeenCalledWith("/products");
  });
});
