import type { User } from "../types/user";

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
