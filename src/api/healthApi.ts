import type { HealthStatus } from "@/types/health";

const HEALTH_PATH = "/api/health";

export async function fetchHealth(apiBaseUrl: string): Promise<HealthStatus> {
  const baseUrl = apiBaseUrl.replace(/\/$/, "");
  const response = await fetch(`${baseUrl}${HEALTH_PATH}`);

  if (!response.ok) {
    throw new Error(`Не удалось проверить API (HTTP ${response.status})`);
  }

  const data: unknown = await response.json();

  if (typeof data !== "object" || data === null) {
    throw new Error("Некорректный ответ API: ожидался объект");
  }

  return data as HealthStatus;
}
