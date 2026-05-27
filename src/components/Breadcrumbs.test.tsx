import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { Breadcrumbs } from "@/components/Breadcrumbs";

describe("Breadcrumbs", () => {
  it("renders trail with link and current page", () => {
    render(
      <MemoryRouter>
        <Breadcrumbs
          items={[{ label: "Пользователи", href: "/users" }, { label: "Alice Smith" }]}
          testId="breadcrumbs"
        />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("breadcrumbs")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Пользователи" })).toHaveAttribute(
      "href",
      "/users",
    );
    expect(screen.getByText("Alice Smith")).toHaveAttribute("aria-current", "page");
  });
});
