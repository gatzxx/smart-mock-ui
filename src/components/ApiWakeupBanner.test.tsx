import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiHealthBadge } from "@/components/ApiHealthBadge";
import { ApiWakeupBanner } from "@/components/ApiWakeupBanner";
import { ApiAvailabilityProvider } from "@/providers/ApiAvailabilityProvider";

function renderWakeupBanner() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <ApiAvailabilityProvider>{children}</ApiAvailabilityProvider>
    </QueryClientProvider>
  );

  return render(
    <>
      <ApiHealthBadge />
      <ApiWakeupBanner />
    </>,
    { wrapper },
  );
}

describe("ApiWakeupBanner", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("shows banner while API health check is pending", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>(() => {})),
    );

    renderWakeupBanner();

    expect(screen.getByTestId("api-wakeup-banner")).toBeInTheDocument();
    expect(screen.getByText(/может стартовать до 30 секунд/i)).toBeInTheDocument();
  });

  it("hides banner when API is online", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "ok",
          uptime: 12,
          timestamp: "2026-05-29T12:00:00.000Z",
        }),
      }),
    );

    renderWakeupBanner();

    await waitFor(() => {
      expect(screen.getByText("API online")).toBeInTheDocument();
      expect(screen.queryByTestId("api-wakeup-banner")).not.toBeInTheDocument();
    });
  });
});
