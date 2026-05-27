import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { NotFoundPage } from "@/pages/NotFoundPage";

describe("NotFoundPage", () => {
  it("renders 404 message and home link", () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("not-found-page")).toBeInTheDocument();
    expect(screen.getByText("404 - страница не найдена")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "На главную" })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
