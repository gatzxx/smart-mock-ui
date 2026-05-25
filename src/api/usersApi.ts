import type { UserDetail } from "@/types/userDetail";
import type { User } from "@/types/user";

const USERS_PATH = "/api/users";

export async function fetchUsers(apiBaseUrl: string): Promise<User[]> {
  const baseUrl = apiBaseUrl.replace(/\/$/, "");
  const response = await fetch(`${baseUrl}${USERS_PATH}`);

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
  const baseUrl = apiBaseUrl.replace(/\/$/, "");
  const response = await fetch(`${baseUrl}${USERS_PATH}/${userId}`);

  if (response.status === 404) {
    throw new Error("Пользователь не найден");
  }

  if (!response.ok) {
    throw new Error(`Не удалось загрузить пользователя (HTTP ${response.status})`);
  }

  const data: unknown = await response.json();

  if (typeof data !== "object" || data === null) {
    throw new Error("Некорректный ответ API: ожидался объект");
  }

  return data as UserDetail;
}

