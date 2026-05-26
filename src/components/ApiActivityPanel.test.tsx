import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { ApiActivityPanel } from "@/components/ApiActivityPanel";
import { trackedFetch } from "@/lib/trackedFetch";
import { ApiActivityProvider } from "@/providers/ApiActivityProvider";

describe("ApiActivityPanel", () => {
  it("renders empty state when there are no requests", () => {
    render(
      <ApiActivityProvider>
        <ApiActivityPanel onClose={() => undefined} />
      </ApiActivityProvider>,
    );

    expect(screen.getByTestId("api-activity-panel")).toBeInTheDocument();
    expect(screen.getByTestId("api-activity-empty")).toBeInTheDocument();
  });

  it("renders tracked request rows", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
      }),
    );

    render(
      <ApiActivityProvider>
        <ApiActivityPanel onClose={() => undefined} />
      </ApiActivityProvider>,
    );

    await trackedFetch("http://localhost:3000/api/users");

    await waitFor(() => {
      expect(screen.getByTestId("api-activity-table")).toBeInTheDocument();
    });

    expect(screen.getByText("/api/users")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();

    vi.unstubAllGlobals();
  });
});
