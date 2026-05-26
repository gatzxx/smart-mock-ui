import { describe, expect, it } from "vitest";

import { parseSchema } from "@/lib/apiClient";
import {
  productDetailSchema,
  productSchema,
} from "@/lib/schemas/productSchemas";
import {
  userDetailSchema,
  userSchema,
} from "@/lib/schemas/userSchemas";

describe("userSchemas", () => {
  it("parses valid user list item", () => {
    const user = parseSchema(
      userSchema,
      {
        id: "user-1",
        fullName: "Jane Doe",
        email: "jane@example.com",
        role: "Engineer",
        createdAt: "2026-05-29T10:00:00.000Z",
      },
      { contextMessage: "user" },
    );

    expect(user.fullName).toBe("Jane Doe");
  });

  it("parses valid user detail", () => {
    const user = parseSchema(
      userDetailSchema,
      {
        id: "user-1",
        fullName: "Jane Doe",
        email: "jane@example.com",
        phone: "+1 555 0100",
        avatar: "https://example.com/avatar.jpg",
        bio: "Bio text",
      },
      { contextMessage: "user detail" },
    );

    expect(user.avatar).toContain("example.com");
  });

  it("rejects invalid user payload", () => {
    expect(() =>
      parseSchema(userSchema, { id: "user-1" }, { contextMessage: "user" }),
    ).toThrow("user");
  });
});

describe("productSchemas", () => {
  it("coerces numeric price to string", () => {
    const product = parseSchema(
      productSchema,
      {
        id: "product-1",
        title: "Mouse",
        price: 29.99,
        inStock: true,
      },
      { contextMessage: "product" },
    );

    expect(product.price).toBe("29.99");
  });

  it("parses valid product detail", () => {
    const product = parseSchema(
      productDetailSchema,
      {
        id: "product-1",
        title: "Mouse",
        price: "29.99",
        inStock: true,
        description: "Wireless mouse",
        updatedAt: "2026-05-29T10:00:00.000Z",
      },
      { contextMessage: "product detail" },
    );

    expect(product.description).toBe("Wireless mouse");
  });
});
