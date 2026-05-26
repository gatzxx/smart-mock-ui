import { describe, expect, it } from "vitest";

import { buildCurlCommand, normalizeMetaRoutes } from "@/lib/metaCurl";
import type { ApiMeta } from "@/types/apiMeta";

describe("metaCurl", () => {
  it("builds GET curl command", () => {
    expect(buildCurlCommand("http://localhost:3000", "GET", "/api/users")).toBe(
      'curl "http://localhost:3000/api/users"',
    );
  });

  it("builds POST curl command with example body", () => {
    expect(buildCurlCommand("http://localhost:3000", "POST", "/api/users")).toBe(
      `curl -X POST "http://localhost:3000/api/users" -H "Content-Type: application/json" -d '{"fullName":"Demo User","email":"demo@example.com","role":"Engineer"}'`,
    );
  });

  it("builds DELETE curl command", () => {
    expect(
      buildCurlCommand("http://localhost:3000", "DELETE", "/api/users/1"),
    ).toBe('curl -X DELETE "http://localhost:3000/api/users/1"');
  });

  it("normalizes routes from meta payload", () => {
    const meta: ApiMeta = {
      basePath: "/api",
      endpoints: ["/api/health"],
      routes: [
        { method: "GET", path: "/api/users" },
        { method: "POST", path: "/api/users" },
      ],
      responseDelayMs: 0,
    };

    expect(normalizeMetaRoutes(meta)).toHaveLength(2);
  });

  it("falls back to GET routes from endpoints list", () => {
    const meta: ApiMeta = {
      basePath: "/api",
      endpoints: ["/api/health"],
      responseDelayMs: 0,
    };

    expect(normalizeMetaRoutes(meta)).toEqual([
      { method: "GET", path: "/api/health" },
    ]);
  });
});
