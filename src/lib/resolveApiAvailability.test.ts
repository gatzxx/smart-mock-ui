import { describe, expect, it } from "vitest";

import { resolveApiAvailability } from "@/constants/apiAvailability";

describe("resolveApiAvailability", () => {
  it("returns online when health status is ok", () => {
    expect(
      resolveApiAvailability({
        data: { status: "ok" },
        failureCount: 0,
        isError: false,
        isFetching: false,
        isPending: false,
      }),
    ).toBe("online");
  });

  it("returns checking on the first health request", () => {
    expect(
      resolveApiAvailability({
        data: undefined,
        failureCount: 0,
        isError: false,
        isFetching: true,
        isPending: true,
      }),
    ).toBe("checking");
  });

  it("returns waking while retrying after a failed attempt", () => {
    expect(
      resolveApiAvailability({
        data: undefined,
        failureCount: 2,
        isError: true,
        isFetching: true,
        isPending: false,
      }),
    ).toBe("waking");
  });

  it("returns offline when retries are exhausted", () => {
    expect(
      resolveApiAvailability({
        data: undefined,
        failureCount: 3,
        isError: true,
        isFetching: false,
        isPending: false,
      }),
    ).toBe("offline");
  });
});
