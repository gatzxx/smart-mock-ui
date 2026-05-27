import { trackedFetch } from "@/lib/trackedFetch";
import type { OpenApiDocument } from "@/types/apiMeta";

export async function fetchOpenApiSpec(
  apiBaseUrl: string,
  openapiPath: string,
): Promise<OpenApiDocument> {
  const baseUrl = apiBaseUrl.replace(/\/$/, "");
  const normalizedPath = openapiPath.startsWith("/") ? openapiPath : `/${openapiPath}`;
  const response = await trackedFetch(`${baseUrl}${normalizedPath}`);

  if (!response.ok) {
    throw new Error(`Не удалось загрузить OpenAPI spec (HTTP ${response.status})`);
  }

  const data: unknown = await response.json();

  if (typeof data !== "object" || data === null) {
    throw new Error("Некорректный ответ API: ожидался объект");
  }

  return data as OpenApiDocument;
}
