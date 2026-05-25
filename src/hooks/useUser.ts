import { useQuery } from "@tanstack/react-query";

import { fetchUser } from "@/api/usersApi";

const USER_DETAIL_QUERY_KEY = "user-detail";

export function useUser(apiBaseUrl: string, userId: string | undefined) {
  return useQuery({
    queryKey: [USER_DETAIL_QUERY_KEY, apiBaseUrl, userId],
    queryFn: () => {
      if (!userId) {
        throw new Error("Пользователь не найден");
      }
      return fetchUser(apiBaseUrl, userId);
    },
    enabled: Boolean(userId),
  });
}
