import { trackedFetch } from "@/lib/trackedFetch";
import type { ApiMeta } from "@/types/apiMeta";

const META_PATH = "/__meta";

export async function fetchMeta(apiBaseUrl: string): Promise<ApiMeta> {
  const baseUrl = apiBaseUrl.replace(/\/$/, "");
  const response = await trackedFetch(`${baseUrl}${META_PATH}`);

  if (!response.ok) {
    throw new Error(`Не удалось загрузить meta API (HTTP ${response.status})`);
  }

  const data: unknown = await response.json();

  if (typeof data !== "object" || data === null) {
    throw new Error("Некорректный ответ API: ожидался объект");
  }

  return data as ApiMeta;
}
