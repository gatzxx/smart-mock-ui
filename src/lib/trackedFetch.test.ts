import { afterEach, describe, expect, it, vi } from "vitest";

import { setApiActivityRecorder } from "@/lib/apiActivityRecorder";
import { trackedFetch } from "@/lib/trackedFetch";

describe("trackedFetch", () => {
  afterEach(() => {
    setApiActivityRecorder(null);
    vi.unstubAllGlobals();
  });

  it("records successful requests", async () => {
    const recorder = vi.fn();
    setApiActivityRecorder(recorder);

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
      }),
    );

    await trackedFetch("http://localhost:3000/api/health");

    expect(recorder).toHaveBeenCalledWith(
      expect.objectContaining({
        method: "GET",
        url: "http://localhost:3000/api/health",
        status: 200,
        ok: true,
      }),
    );
  });

  it("records failed network requests", async () => {
    const recorder = vi.fn();
    setApiActivityRecorder(recorder);

    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network down")));

    await expect(trackedFetch("http://localhost:3000/api/users")).rejects.toThrow(
      "Network down",
    );

    expect(recorder).toHaveBeenCalledWith(
      expect.objectContaining({
        ok: false,
        status: null,
        errorMessage: "Network down",
      }),
    );
  });
});
