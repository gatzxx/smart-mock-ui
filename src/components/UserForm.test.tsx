import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { UserForm } from "@/components/UserForm";

function renderUserForm(props: React.ComponentProps<typeof UserForm>) {
  return render(
    <MemoryRouter>
      <UserForm {...props} />
    </MemoryRouter>,
  );
}

describe("UserForm", () => {
  afterEach(() => {
    cleanup();
  });
  it("disables submit until form values change", () => {
    renderUserForm({
      defaultValues: {
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        role: "Engineer",
      },
      isSubmitting: false,
      submitLabel: "Сохранить",
      onCancel: vi.fn(),
      onSubmit: vi.fn(),
    });

    expect(screen.getByRole("button", { name: "Сохранить" })).toBeDisabled();
  });

  it("shows validation errors for invalid input", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    renderUserForm({
      isSubmitting: false,
      submitLabel: "Создать",
      onCancel: vi.fn(),
      onSubmit: handleSubmit,
    });

    await user.type(screen.getByLabelText("Email"), "invalid-email");
    await user.click(screen.getByRole("button", { name: "Создать" }));

    const emailInput = screen.getByLabelText("Email");

    expect(await screen.findByText("Некорректный email")).toBeInTheDocument();
    expect(emailInput).toHaveAttribute("aria-invalid", "true");
    expect(emailInput).toHaveAttribute("aria-describedby", "user-email-error");
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("submits valid values", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    renderUserForm({
      isSubmitting: false,
      submitLabel: "Создать",
      onCancel: vi.fn(),
      onSubmit: handleSubmit,
    });

    await user.type(screen.getByLabelText("Имя"), "Ada Lovelace");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Роль"), "Engineer");
    await user.click(screen.getByRole("button", { name: "Создать" }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        fullName: "Ada Lovelace",
        email: "ada@example.com",
        role: "Engineer",
      });
    });
  });
});
