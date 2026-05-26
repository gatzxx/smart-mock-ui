import { trackedFetch } from "@/lib/trackedFetch";
import type { UserDetail } from "@/types/userDetail";
import type { User } from "@/types/user";

const USERS_PATH = "/api/users";

export type CreateUserInput = {
  fullName: string;
  email: string;
  role: string;
};

export type UpdateUserInput = CreateUserInput;

function normalizeBaseUrl(apiBaseUrl: string): string {
  return apiBaseUrl.replace(/\/$/, "");
}

async function parseObjectResponse(
  response: Response,
  errorMessage: string,
): Promise<Record<string, unknown>> {
  if (!response.ok) {
    throw new Error(`${errorMessage} (HTTP ${response.status})`);
  }

  const data: unknown = await response.json();

  if (typeof data !== "object" || data === null) {
    throw new Error("Некорректный ответ API: ожидался объект");
  }

  return data as Record<string, unknown>;
}

export async function fetchUsers(apiBaseUrl: string): Promise<User[]> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const response = await trackedFetch(`${baseUrl}${USERS_PATH}`);

  if (!response.ok) {
    throw new Error(`Не удалось загрузить пользователей (HTTP ${response.status})`);
  }

  const data: unknown = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Некорректный ответ API: ожидался массив");
  }

  return data as User[];
}

export async function fetchUser(
  apiBaseUrl: string,
  userId: string,
): Promise<UserDetail> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const response = await trackedFetch(`${baseUrl}${USERS_PATH}/${userId}`);

  if (response.status === 404) {
    throw new Error("Пользователь не найден");
  }

  if (!response.ok) {
    throw new Error(`Не удалось загрузить пользователя (HTTP ${response.status})`);
  }

  const data = await parseObjectResponse(
    response,
    "Не удалось загрузить пользователя",
  );

  return data as UserDetail;
}

export async function createUser(
  apiBaseUrl: string,
  input: CreateUserInput,
): Promise<User> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const response = await trackedFetch(`${baseUrl}${USERS_PATH}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await parseObjectResponse(
    response,
    "Не удалось создать пользователя",
  );

  return data as User;
}

export async function updateUser(
  apiBaseUrl: string,
  userId: string,
  input: UpdateUserInput,
): Promise<UserDetail> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const response = await trackedFetch(`${baseUrl}${USERS_PATH}/${userId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (response.status === 404) {
    throw new Error("Пользователь не найден");
  }

  const data = await parseObjectResponse(
    response,
    "Не удалось обновить пользователя",
  );

  return data as UserDetail;
}

export async function deleteUser(
  apiBaseUrl: string,
  userId: string,
): Promise<void> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const response = await trackedFetch(`${baseUrl}${USERS_PATH}/${userId}`, {
    method: "DELETE",
  });

  if (response.status === 404) {
    throw new Error("Пользователь не найден");
  }

  if (!response.ok) {
    throw new Error(`Не удалось удалить пользователя (HTTP ${response.status})`);
  }
}
