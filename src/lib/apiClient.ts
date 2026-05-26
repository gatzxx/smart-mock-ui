import { z } from "zod";

type ParseSchemaOptions = {
  contextMessage: string;
};

export function normalizeBaseUrl(apiBaseUrl: string): string {
  return apiBaseUrl.replace(/\/$/, "");
}

export async function readJsonResponse(response: Response): Promise<unknown> {
  return response.json();
}

export async function ensureOkResponse(
  response: Response,
  errorMessage: string,
  notFoundMessage?: string,
): Promise<Response> {
  if (notFoundMessage && response.status === 404) {
    throw new Error(notFoundMessage);
  }

  if (!response.ok) {
    throw new Error(`${errorMessage} (HTTP ${response.status})`);
  }

  return response;
}

export function parseSchema<T>(
  schema: z.ZodType<T>,
  data: unknown,
  options: ParseSchemaOptions,
): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new Error(`${options.contextMessage}: ${result.error.message}`);
  }

  return result.data;
}

export async function parseObjectResponse<T>(
  response: Response,
  schema: z.ZodType<T>,
  errorMessage: string,
  notFoundMessage?: string,
): Promise<T> {
  await ensureOkResponse(response, errorMessage, notFoundMessage);
  const data = await readJsonResponse(response);
  return parseSchema(schema, data, { contextMessage: "Некорректный ответ API" });
}

export async function parseListResponse<T>(
  response: Response,
  itemSchema: z.ZodType<T>,
  errorMessage: string,
): Promise<T[]> {
  await ensureOkResponse(response, errorMessage);
  const data = await readJsonResponse(response);
  return parseSchema(z.array(itemSchema), data, {
    contextMessage: "Некорректный ответ API",
  });
}
