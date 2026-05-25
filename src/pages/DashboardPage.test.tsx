import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DashboardPage } from "@/pages/DashboardPage";

function renderDashboardPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{children}</MemoryRouter>
    </QueryClientProvider>
  );

  return render(<DashboardPage />, { wrapper });
}

describe("DashboardPage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders skeleton while dashboard data is loading", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>(() => {})),
    );

    renderDashboardPage();

    expect(screen.getByTestId("dashboard-skeleton")).toBeInTheDocument();
  });

  it("renders error state when users request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((input: RequestInfo | URL) => {
        const url = String(input);

        if (url.includes("/api/users")) {
          return Promise.resolve({
            ok: false,
            status: 500,
          });
        }

        if (url.includes("/api/products")) {
          return Promise.resolve({
            ok: true,
            json: async () => [],
          });
        }

        if (url.includes("/api/health")) {
          return Promise.resolve({
            ok: true,
            json: async () => ({
              status: "ok",
              uptime: 42,
              timestamp: "2026-05-29T12:00:00.000Z",
            }),
          });
        }

        return Promise.reject(new Error(`Unexpected fetch: ${url}`));
      }),
    );

    renderDashboardPage();

    expect(await screen.findByTestId("users-error")).toBeInTheDocument();
    expect(screen.getByText(/HTTP 500/i)).toBeInTheDocument();
  });
});
