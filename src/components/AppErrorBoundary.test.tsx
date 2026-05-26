import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { AppErrorBoundary } from "@/components/AppErrorBoundary";

function ThrowError(): null {
  throw new Error("Test render error");
}

describe("AppErrorBoundary", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("renders fallback when a child throws during render", () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <AppErrorBoundary>
        <ThrowError />
      </AppErrorBoundary>,
    );

    expect(screen.getByTestId("app-error-boundary")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Что-то пошло не так");
    expect(
      screen.getByRole("button", { name: "Перезагрузить страницу" }),
    ).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it("renders children when no error occurs", () => {
    render(
      <AppErrorBoundary>
        <p>Safe content</p>
      </AppErrorBoundary>,
    );

    expect(screen.getByText("Safe content")).toBeInTheDocument();
    expect(screen.queryByTestId("app-error-boundary")).not.toBeInTheDocument();
  });
});
