import { describe, expect, it } from "vitest";

import { formatHealthTimestamp, formatUptimeSeconds } from "@/lib/formatHealth";

describe("formatHealth", () => {
  it("formats uptime in seconds for short durations", () => {
    expect(formatUptimeSeconds(42)).toBe("42 с");
  });

  it("formats uptime in minutes for longer durations", () => {
    expect(formatUptimeSeconds(125)).toBe("2 мин");
  });

  it("formats health timestamp for dashboard copy", () => {
    expect(formatHealthTimestamp("2026-05-29T05:13:49.791Z")).toMatch(/29\.05/);
  });
});
