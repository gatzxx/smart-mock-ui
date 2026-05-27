import { QueryClient } from "@tanstack/react-query";
import { describe, expect, it, vi } from "vitest";

import {
  appendToListCache,
  getListCount,
  invalidateListQuery,
  removeFromListCache,
  syncListAfterUpdate,
  updateListCacheItem,
  upsertListCacheItem,
} from "@/lib/listQueryCache";

describe("listQueryCache", () => {
  it("invalidates list queries including inactive ones", async () => {
    const queryClient = new QueryClient();
    const queryKey = ["products", "http://localhost:3000"] as const;
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    await invalidateListQuery(queryClient, queryKey);

    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey,
      refetchType: "all",
    });
  });

  it("appends created item to cached list", () => {
    const queryClient = new QueryClient();
    const queryKey = ["products", "http://localhost:3000"] as const;

    queryClient.setQueryData(queryKey, [{ id: "1", title: "Existing" }]);

    appendToListCache(queryClient, queryKey, { id: "2", title: "Created" });

    expect(queryClient.getQueryData(queryKey)).toEqual([
      { id: "1", title: "Existing" },
      { id: "2", title: "Created" },
    ]);
  });

  it("updates cached list item", () => {
    const queryClient = new QueryClient();
    const queryKey = ["products", "http://localhost:3000"] as const;

    queryClient.setQueryData(queryKey, [{ id: "1", title: "Before" }]);

    updateListCacheItem(queryClient, queryKey, "1", (item) => ({
      ...item,
      title: "After",
    }));

    expect(queryClient.getQueryData(queryKey)).toEqual([{ id: "1", title: "After" }]);
  });

  it("upserts cached list item", () => {
    const queryClient = new QueryClient();
    const queryKey = ["products", "http://localhost:3000"] as const;

    queryClient.setQueryData(queryKey, [{ id: "1", title: "Before", inStock: true }]);

    upsertListCacheItem(queryClient, queryKey, {
      id: "1",
      title: "After",
      inStock: false,
    });

    expect(queryClient.getQueryData(queryKey)).toEqual([
      { id: "1", title: "After", inStock: false },
    ]);
  });

  it("removes deleted item from cached list", () => {
    const queryClient = new QueryClient();
    const queryKey = ["products", "http://localhost:3000"] as const;

    queryClient.setQueryData(queryKey, [
      { id: "1", title: "Keep" },
      { id: "2", title: "Remove" },
    ]);

    removeFromListCache(queryClient, queryKey, "2");

    expect(queryClient.getQueryData(queryKey)).toEqual([{ id: "1", title: "Keep" }]);
  });

  it("syncListAfterUpdate updates cache and invalidates query", async () => {
    const queryClient = new QueryClient();
    const queryKey = ["products", "http://localhost:3000"] as const;
    const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

    queryClient.setQueryData(queryKey, [{ id: "1", title: "Before", inStock: true }]);

    syncListAfterUpdate(queryClient, queryKey, {
      id: "1",
      title: "After",
      inStock: false,
    });

    expect(queryClient.getQueryData(queryKey)).toEqual([
      { id: "1", title: "After", inStock: false },
    ]);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey,
      refetchType: "all",
    });
  });

  it("returns list count from cache", () => {
    const queryClient = new QueryClient();
    const queryKey = ["users", "http://localhost:3000"] as const;

    queryClient.setQueryData(queryKey, [{ id: "1" }, { id: "2" }]);

    expect(getListCount(queryClient, queryKey)).toBe(2);
  });
});
