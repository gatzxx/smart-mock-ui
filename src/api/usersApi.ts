import { trackedFetch } from "@/lib/trackedFetch";
import {
  normalizeBaseUrl,
  parseListResponse,
  parseObjectResponse,
  ensureOkResponse,
} from "@/lib/apiClient";
import { userDetailSchema, userSchema } from "@/lib/schemas/userSchemas";
import type { UserDetail } from "@/types/userDetail";
import type { User } from "@/types/user";

const USERS_PATH = "/api/users";

export type CreateUserInput = {
  fullName: string;
  email: string;
  role: string;
};

export type UpdateUserInput = CreateUserInput;

export async function fetchUsers(apiBaseUrl: string): Promise<User[]> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const response = await trackedFetch(`${baseUrl}${USERS_PATH}`);

  return parseListResponse(
    response,
    userSchema,
    "Не удалось загрузить пользователей",
  );
}

export async function fetchUser(
  apiBaseUrl: string,
  userId: string,
): Promise<UserDetail> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const response = await trackedFetch(`${baseUrl}${USERS_PATH}/${userId}`);

  return parseObjectResponse(
    response,
    userDetailSchema,
    "Не удалось загрузить пользователя",
    "Пользователь не найден",
  );
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

  return parseObjectResponse(
    response,
    userSchema,
    "Не удалось создать пользователя",
  );
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

  return parseObjectResponse(
    response,
    userDetailSchema,
    "Не удалось обновить пользователя",
    "Пользователь не найден",
  );
}

export async function deleteUser(
  apiBaseUrl: string,
  userId: string,
): Promise<void> {
  const baseUrl = normalizeBaseUrl(apiBaseUrl);
  const response = await trackedFetch(`${baseUrl}${USERS_PATH}/${userId}`, {
    method: "DELETE",
  });

  await ensureOkResponse(
    response,
    "Не удалось удалить пользователя",
    "Пользователь не найден",
  );
}
