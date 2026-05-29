import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";

import { CreateEntityButton } from "@/components/CreateEntityButton";
import { ApiAvailabilityProvider } from "@/providers/ApiAvailabilityProvider";

function renderCreateButton() {
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

  return render(
    <CreateEntityButton
      label="Пользователь"
      testId="users-create-button"
      to="/users/new"
    />,
    { wrapper },
  );
}

describe("CreateEntityButton", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("disables create action while API is waking up", () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => new Promise<Response>(() => {})),
    );

    renderCreateButton();

    expect(screen.getByTestId("users-create-button")).toBeDisabled();
  });

  it("enables create action when API is online", async () => {
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

    renderCreateButton();

    expect(
      await screen.findByRole("link", { name: /пользователь/i }),
    ).toBeInTheDocument();
  });
});
