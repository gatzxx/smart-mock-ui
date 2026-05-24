import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { User } from "../types/user";
import { UserTable } from "./UserTable";

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
    render(<UserTable users={mockUsers} />);

    expect(screen.getByTestId("user-table")).toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("Engineer")).toBeInTheDocument();
    expect(screen.getByText("Bob Jones")).toBeInTheDocument();
  });
});
