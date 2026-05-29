import { HEALTH_REQUEST_TIMEOUT_MS } from "@/constants/apiAvailability";
import { trackedFetch } from "@/lib/trackedFetch";
import type { HealthStatus } from "@/types/health";

const HEALTH_PATH = "/api/health";

function getHealthFetchError(error: unknown): Error {
  if (error instanceof DOMException && error.name === "AbortError") {
    return new Error("Превышено время ожидания ответа API");
  }

  if (error instanceof Error) {
    return error;
  }

  return new Error("Сетевая ошибка при проверке API");
}

export async function fetchHealth(apiBaseUrl: string): Promise<HealthStatus> {
  const baseUrl = apiBaseUrl.replace(/\/$/, "");
  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    HEALTH_REQUEST_TIMEOUT_MS,
  );

  try {
    const response = await trackedFetch(`${baseUrl}${HEALTH_PATH}`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Не удалось проверить API (HTTP ${response.status})`);
    }

    const data: unknown = await response.json();

    if (typeof data !== "object" || data === null) {
      throw new Error("Некорректный ответ API: ожидался объект");
    }

    return data as HealthStatus;
  } catch (error) {
    throw getHealthFetchError(error);
  } finally {
    window.clearTimeout(timeoutId);
  }
}
