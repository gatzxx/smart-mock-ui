import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import type { User } from "@/types/user";
import { UserTable } from "@/components/UserTable";

const mockUsers: User[] = [
  {
    id: "1",
    fullName: "Alice Smith",
    email: "alice@example.com",
    role: "Engineer",
  },
  {
    id: "2",
    fullName: "Bob Jones",
    email: "bob@example.com",
    role: "Designer",
  },
];

describe("UserTable", () => {
  it("renders user list with mock data", () => {
    render(
      <MemoryRouter>
        <UserTable users={mockUsers} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("user-table")).toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Alice Smith" })).toHaveAttribute(
      "href",
      "/users/1",
    );
  });
});
