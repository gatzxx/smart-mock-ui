import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { MetaPage } from "@/pages/MetaPage";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockMeta = {
  basePath: "/api",
  endpoints: ["/api/users", "/api/health"],
  routes: [
    { method: "GET", path: "/api/users" },
    { method: "POST", path: "/api/users" },
    { method: "GET", path: "/api/health" },
  ],
  openapiPath: "/openapi.json",
  schemaVersion: 123456,
  responseDelayMs: 250,
};

function renderMetaPage() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  vi.stubGlobal(
    "fetch",
    vi.fn().mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);

      if (url.includes("/__meta")) {
        return Promise.resolve({
          ok: true,
          json: async () => mockMeta,
        });
      }

      if (url.includes("/openapi.json")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ openapi: "3.1.0", paths: {} }),
        });
      }

      return Promise.reject(new Error(`Unexpected fetch: ${url}`));
    }),
  );

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  return render(<MetaPage />, { wrapper });
}

describe("MetaPage", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("renders route methods from meta payload", async () => {
    renderMetaPage();

    expect(await screen.findByTestId("meta-page")).toBeInTheDocument();
    expect(screen.getByText("POST")).toBeInTheDocument();
    expect(screen.getAllByText("GET").length).toBeGreaterThan(0);
    expect(screen.getByText("Версия схемы: 123456")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "/openapi.json" })).toHaveAttribute(
      "href",
      "http://localhost:3000/openapi.json",
    );
  });

  it("copies curl command for POST route", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    renderMetaPage();
    await screen.findByTestId("meta-page");

    const copyButtons = screen.getAllByRole("button", { name: /curl/i });
    await user.click(copyButtons[1] ?? copyButtons[0]);

    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('-X POST "http://localhost:3000/api/users"'),
    );
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("-d '{"));
  });
});
