import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { THEME_STORAGE_KEY } from "@/constants/theme";
import { ThemeProvider } from "@/providers/ThemeProvider";

describe("ThemeProvider", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
    window.localStorage.removeItem(THEME_STORAGE_KEY);
  });

  it("applies stored dark theme on mount to avoid flash", () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

    render(
      <ThemeProvider>
        <div data-testid="theme-child">Content</div>
      </ThemeProvider>,
    );

    expect(screen.getByTestId("theme-child")).toBeInTheDocument();
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(document.documentElement.style.colorScheme).toBe("dark");
  });
});
