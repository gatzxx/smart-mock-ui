import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, render, screen, within } from "@testing-library/react";
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
    cleanup();
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

  it("expands curl preview for a route", async () => {
    const user = userEvent.setup();

    renderMetaPage();
    await screen.findByTestId("meta-page");

    expect(
      screen.queryByTestId("meta-route-curl-POST-/api/users"),
    ).not.toBeInTheDocument();

    await user.click(screen.getByTestId("meta-route-POST-/api/users"));

    expect(screen.getByTestId("meta-route-curl-POST-/api/users")).toBeInTheDocument();
    expect(
      screen.getByText(/-X POST "http:\/\/localhost:3000\/api\/users"/),
    ).toBeInTheDocument();
  });

  it("copies curl command from expanded preview", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    renderMetaPage();
    await screen.findByTestId("meta-page");

    await user.click(screen.getByTestId("meta-route-POST-/api/users"));

    const curlPanel = screen.getByTestId("meta-route-curl-POST-/api/users");
    await user.click(within(curlPanel).getByRole("button", { name: "Копировать" }));

    expect(writeText).toHaveBeenCalledWith(
      expect.stringContaining('-X POST "http://localhost:3000/api/users"'),
    );
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining("-d '{"));
  });

  it("keeps only one expanded curl preview at a time", async () => {
    const user = userEvent.setup();

    renderMetaPage();
    await screen.findByTestId("meta-page");

    await user.click(screen.getByTestId("meta-route-POST-/api/users"));
    expect(screen.getByTestId("meta-route-curl-POST-/api/users")).toBeInTheDocument();

    await user.click(screen.getByTestId("meta-route-GET-/api/health"));
    expect(
      screen.queryByTestId("meta-route-curl-POST-/api/users"),
    ).not.toBeInTheDocument();
    expect(screen.getByTestId("meta-route-curl-GET-/api/health")).toBeInTheDocument();
  });

  it("sorts routes by path when header is clicked", async () => {
    const user = userEvent.setup();

    renderMetaPage();
    await screen.findByTestId("meta-endpoints-table");

    const pathRows = () =>
      screen
        .getAllByTestId(/^meta-route-/)
        .map(
          (row) => row.getAttribute("data-testid")?.split("-").slice(3).join("-") ?? "",
        );

    expect(pathRows()[0]).toContain("/api/users");

    await user.click(screen.getByRole("button", { name: "Сортировать: Путь" }));

    expect(pathRows()[0]).toContain("/api/health");
  });
});
