import { recordApiActivity } from "@/lib/apiActivityRecorder";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Сетевая ошибка";
}

export async function trackedFetch(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<Response> {
  const url = String(input);
  const method = init?.method ?? "GET";
  const startedAt = performance.now();

  try {
    const response = await fetch(input, init);
    const durationMs = Math.round(performance.now() - startedAt);

    recordApiActivity({
      method,
      url,
      status: response.status,
      durationMs,
      ok: response.ok,
      timestamp: new Date().toISOString(),
    });

    return response;
  } catch (error) {
    const durationMs = Math.round(performance.now() - startedAt);

    recordApiActivity({
      method,
      url,
      status: null,
      durationMs,
      ok: false,
      timestamp: new Date().toISOString(),
      errorMessage: getErrorMessage(error),
    });

    throw error;
  }
}
