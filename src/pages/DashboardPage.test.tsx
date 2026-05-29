import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DashboardPage } from "@/pages/DashboardPage";
import { ApiAvailabilityProvider } from "@/providers/ApiAvailabilityProvider";

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
      <ApiAvailabilityProvider>
        <MemoryRouter>{children}</MemoryRouter>
      </ApiAvailabilityProvider>
    </QueryClientProvider>
  );

  return render(<DashboardPage />, { wrapper });
}

describe("DashboardPage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders cold start alert while API is waking up", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>(() => {})),
    );

    renderDashboardPage();

    expect(screen.getByTestId("api-cold-start-alert")).toBeInTheDocument();
    expect(screen.queryByTestId("dashboard-skeleton")).not.toBeInTheDocument();
  });

  it("renders skeleton while dashboard data is loading", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockImplementation((input: RequestInfo | URL) => {
        const url = String(input);

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

        return new Promise<Response>(() => {});
      }),
    );

    renderDashboardPage();

    expect(await screen.findByTestId("dashboard-skeleton")).toBeInTheDocument();
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
