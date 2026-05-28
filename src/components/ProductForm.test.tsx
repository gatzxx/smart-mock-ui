import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";

import { ProductForm } from "@/components/ProductForm";

function renderProductForm(props: React.ComponentProps<typeof ProductForm>) {
  return render(
    <MemoryRouter>
      <ProductForm {...props} />
    </MemoryRouter>,
  );
}

describe("ProductForm", () => {
  afterEach(() => {
    cleanup();
  });

  it("disables submit until form values change", () => {
    renderProductForm({
      defaultValues: {
        title: "Wireless Mouse",
        price: 29.99,
        inStock: true,
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

    renderProductForm({
      isSubmitting: false,
      submitLabel: "Создать",
      onCancel: vi.fn(),
      onSubmit: handleSubmit,
    });

    await user.type(screen.getByLabelText("Название"), "Test Product");
    await user.clear(screen.getByLabelText("Цена"));
    await user.type(screen.getByLabelText("Цена"), "0");
    await user.click(screen.getByRole("button", { name: "Создать" }));

    const priceInput = screen.getByLabelText("Цена");

    expect(await screen.findByText("Цена должна быть больше 0")).toBeInTheDocument();
    expect(priceInput).toHaveAttribute("aria-invalid", "true");
    expect(priceInput).toHaveAttribute("aria-describedby", "product-price-error");
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it("submits valid values", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    renderProductForm({
      isSubmitting: false,
      submitLabel: "Создать",
      onCancel: vi.fn(),
      onSubmit: handleSubmit,
    });

    await user.type(screen.getByLabelText("Название"), "Wireless Mouse");
    await user.clear(screen.getByLabelText("Цена"));
    await user.type(screen.getByLabelText("Цена"), "29.99");
    await user.click(screen.getByRole("button", { name: "Создать" }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        title: "Wireless Mouse",
        price: 29.99,
        inStock: true,
      });
    });
  });
});
