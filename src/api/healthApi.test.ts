import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { fetchHealth } from "@/api/healthApi";
import { HEALTH_REQUEST_TIMEOUT_MS } from "@/constants/apiAvailability";

describe("fetchHealth", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("throws timeout error when health request hangs", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((_input: RequestInfo | URL, init?: RequestInit) => {
        return new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("The operation was aborted.", "AbortError"));
          });
        });
      }),
    );

    const healthPromise = fetchHealth("http://localhost:3000");
    const assertion = expect(healthPromise).rejects.toThrow(
      "Превышено время ожидания ответа API",
    );

    await vi.advanceTimersByTimeAsync(HEALTH_REQUEST_TIMEOUT_MS);
    await assertion;
  });

  it("returns health payload when API responds", async () => {
    vi.useRealTimers();

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          status: "ok",
          uptime: 42,
          timestamp: "2026-05-29T12:00:00.000Z",
        }),
      }),
    );

    await expect(fetchHealth("http://localhost:3000")).resolves.toEqual({
      status: "ok",
      uptime: 42,
      timestamp: "2026-05-29T12:00:00.000Z",
    });
  });
});
