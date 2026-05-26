import { useMemo } from "react";

const DEFAULT_API_BASE_URL = "http://localhost:3000";

export function useApiBaseUrl(): string {
  return useMemo(
    () => import.meta.env.VITE_API_URL ?? DEFAULT_API_BASE_URL,
    [],
  );
}
