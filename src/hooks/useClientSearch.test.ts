import { renderHook, act } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useClientSearch } from "@/hooks/useClientSearch";

const items = [
  { id: "1", name: "Alice Smith", email: "alice@example.com" },
  { id: "2", name: "Bob Jones", email: "bob@example.com" },
];

describe("useClientSearch", () => {
  it("filters items by query", () => {
    const { result } = renderHook(() =>
      useClientSearch(items, (item) => `${item.name} ${item.email}`),
    );

    expect(result.current.filteredItems).toHaveLength(2);

    act(() => {
      result.current.setQuery("bob");
    });

    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0]?.name).toBe("Bob Jones");
  });
});
