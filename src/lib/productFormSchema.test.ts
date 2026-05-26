import { describe, expect, it } from "vitest";

import { parseProductPrice } from "@/lib/productFormSchema";

describe("parseProductPrice", () => {
  it("parses numeric price", () => {
    expect(parseProductPrice(42.5)).toBe(42.5);
  });

  it("parses formatted string price", () => {
    expect(parseProductPrice("$29.99")).toBe(29.99);
  });
});
