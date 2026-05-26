import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
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

const API_BASE_URL = "http://localhost:3000";

function renderUserTable() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <UserTable apiBaseUrl={API_BASE_URL} users={mockUsers} />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

describe("UserTable", () => {
  it("renders user list with mock data", () => {
    renderUserTable();

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
