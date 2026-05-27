import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { JSON_COPIED_TOAST_MESSAGE } from "@/constants/toast";
import { MetaPage } from "@/pages/MetaPage";
import { toast } from "sonner";

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockMeta = {
  basePath: "/api",
  endpoints: ["/api/users", "/api/users/:id", "/api/products", "/api/health"],
  routes: [
    { method: "GET", path: "/api/users" },
    { method: "POST", path: "/api/users" },
    { method: "PATCH", path: "/api/users/:id" },
    { method: "DELETE", path: "/api/users/:id" },
    { method: "GET", path: "/api/products" },
    { method: "GET", path: "/api/health" },
  ],
  openapiPath: "/openapi.json",
  schemaVersion: 123456,
  responseDelayMs: 250,
};

const mockOpenApiSpec = {
  openapi: "3.1.0",
  paths: {
    "/api/users": {
      get: { operationId: "listUsers" },
      post: { operationId: "createUser" },
    },
  },
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
          json: async () => mockOpenApiSpec,
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

describe("MetaPage integration", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it("renders methods column and mutation routes in endpoints table", async () => {
    renderMetaPage();

    expect(await screen.findByTestId("meta-endpoints-table")).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Путь" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Метод" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Действия" })).toBeInTheDocument();

    expect(screen.getByTestId("meta-route-PATCH-/api/users/:id")).toBeInTheDocument();
    expect(screen.getByTestId("meta-route-DELETE-/api/users/:id")).toBeInTheDocument();
    expect(screen.getAllByText("PATCH").length).toBeGreaterThan(0);
    expect(screen.getAllByText("DELETE").length).toBeGreaterThan(0);
  });

  it("shows openapi link and loads preview json on demand", async () => {
    const user = userEvent.setup();

    renderMetaPage();

    expect(await screen.findByTestId("openapi-preview")).toBeInTheDocument();

    const openApiLink = screen.getByRole("link", { name: "/openapi.json" });
    expect(openApiLink).toHaveAttribute("href", "http://localhost:3000/openapi.json");

    await user.click(screen.getByRole("button", { name: "Показать JSON" }));

    expect(await screen.findByText(/"operationId": "createUser"/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Скрыть JSON" })).toBeInTheDocument();

    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    await user.click(screen.getByRole("button", { name: "Копировать" }));

    expect(writeText).toHaveBeenCalledWith(JSON.stringify(mockOpenApiSpec, null, 2));
    expect(toast.success).toHaveBeenCalledWith(JSON_COPIED_TOAST_MESSAGE);
  });
});
