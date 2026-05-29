import type { QueryClient } from "@tanstack/react-query";

export const HEALTH_COLD_START_MAX_ATTEMPTS = 8;

export const HEALTH_COLD_START_RETRY_BASE_MS = 1_000;

export const HEALTH_COLD_START_RETRY_MAX_MS = 8_000;

export const HEALTH_REQUEST_TIMEOUT_MS = 12_000;

export const HEALTH_COLD_START_POLL_INTERVAL_MS = 3_000;

export const API_COLD_START_WAIT_HINT_SECONDS = 30;

export type ApiAvailabilityStatus = "checking" | "waking" | "online" | "offline";

type ResolveApiAvailabilityParams = {
  data: { status: string } | undefined;
  failureCount: number;
  isError: boolean;
  isFetching: boolean;
  isPending: boolean;
};

export function getHealthRetryDelay(attemptIndex: number): number {
  return Math.min(
    HEALTH_COLD_START_RETRY_BASE_MS * 2 ** attemptIndex,
    HEALTH_COLD_START_RETRY_MAX_MS,
  );
}

export function resolveApiAvailability({
  data,
  failureCount,
  isError,
  isFetching,
  isPending,
}: ResolveApiAvailabilityParams): ApiAvailabilityStatus {
  if (data?.status === "ok") {
    return "online";
  }

  if (isError && !isFetching) {
    return "offline";
  }

  if (failureCount > 0 || (isError && isFetching)) {
    return "waking";
  }

  if (isPending || isFetching) {
    return "checking";
  }

  return "offline";
}

export function configureHealthQueryDefaults(queryClient: QueryClient): void {
  queryClient.setQueryDefaults(["health"], {
    retry: HEALTH_COLD_START_MAX_ATTEMPTS,
    retryDelay: getHealthRetryDelay,
    staleTime: 0,
  });
}
