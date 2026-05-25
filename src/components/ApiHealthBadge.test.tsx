import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiHealthBadge } from "@/components/ApiHealthBadge";

function renderWithQueryClient(ui: ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("ApiHealthBadge", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("shows loading state before health response", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>(() => {})),
    );

    renderWithQueryClient(<ApiHealthBadge apiBaseUrl="http://localhost:3000" />);

    expect(screen.getByTestId("api-health-badge")).toHaveTextContent("Проверка API...");
  });

  it("shows error state and retry control when health check fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }),
    );

    renderWithQueryClient(<ApiHealthBadge apiBaseUrl="http://localhost:3000" />);

    expect(await screen.findByText("API недоступен")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Повторить проверку API" })).toBeInTheDocument();
  });
});
