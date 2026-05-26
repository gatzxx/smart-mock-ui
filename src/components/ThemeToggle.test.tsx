import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { ThemeToggle } from "@/components/ThemeToggle";
import { THEME_STORAGE_KEY } from "@/constants/theme";

describe("ThemeToggle", () => {
  afterEach(() => {
    document.documentElement.classList.remove("dark");
    window.localStorage.removeItem(THEME_STORAGE_KEY);
  });

  it("toggles dark theme class and persists choice", () => {
    render(<ThemeToggle />);

    expect(document.documentElement.classList.contains("dark")).toBe(false);

    fireEvent.click(screen.getByTestId("theme-toggle"));

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");

    fireEvent.click(screen.getByTestId("theme-toggle"));

    expect(document.documentElement.classList.contains("dark")).toBe(false);
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("light");
  });
});
