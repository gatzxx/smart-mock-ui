import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { UserDetailCard } from "@/components/UserDetailCard";
import type { UserDetail } from "@/types/userDetail";

const mockUser: UserDetail = {
  id: "user-1",
  fullName: "Alice Smith",
  email: "alice@example.com",
  phone: "+1 555 0100",
  avatar: "https://example.com/avatar.jpg",
  bio: "Frontend developer.",
};

describe("UserDetailCard", () => {
  it("renders user profile fields", () => {
    render(
      <MemoryRouter>
        <UserDetailCard user={mockUser} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("user-detail-card")).toBeInTheDocument();
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("alice@example.com")).toBeInTheDocument();
    expect(screen.getByText("+1 555 0100")).toBeInTheDocument();
    expect(screen.getByText("Frontend developer.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /К списку/i })).toHaveAttribute("href", "/users");
  });
});
