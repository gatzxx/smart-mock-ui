import { describe, expect, it } from "vitest";

import {
  getNextMetaRouteSortState,
  sortMetaRoutes,
  type MetaRouteSortState,
} from "@/lib/sortMetaRoutes";
import type { ApiMetaRoute } from "@/types/apiMeta";

const mockRoutes: ApiMetaRoute[] = [
  { method: "POST", path: "/api/users" },
  { method: "GET", path: "/api/health" },
  { method: "DELETE", path: "/api/users/:id" },
  { method: "GET", path: "/api/users" },
];

describe("sortMetaRoutes", () => {
  it("returns original order when sort state is null", () => {
    expect(sortMetaRoutes(mockRoutes, null)).toEqual(mockRoutes);
  });

  it("sorts routes by path ascending", () => {
    const sortState: MetaRouteSortState = { field: "path", direction: "asc" };

    expect(sortMetaRoutes(mockRoutes, sortState).map((route) => route.path)).toEqual([
      "/api/health",
      "/api/users",
      "/api/users",
      "/api/users/:id",
    ]);
  });

  it("sorts routes by method ascending with path as tie-breaker", () => {
    const sortState: MetaRouteSortState = { field: "method", direction: "asc" };

    expect(sortMetaRoutes(mockRoutes, sortState)).toEqual([
      { method: "DELETE", path: "/api/users/:id" },
      { method: "GET", path: "/api/health" },
      { method: "GET", path: "/api/users" },
      { method: "POST", path: "/api/users" },
    ]);
  });

  it("starts ascending sort for a new field", () => {
    expect(getNextMetaRouteSortState(null, "path")).toEqual({
      field: "path",
      direction: "asc",
    });
  });

  it("clears sort on third click for the same field", () => {
    expect(
      getNextMetaRouteSortState({ field: "path", direction: "desc" }, "path"),
    ).toBeNull();
  });
});
