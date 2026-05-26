import { useQuery } from "@tanstack/react-query";

import { fetchUser } from "@/api/usersApi";
import { queryKeys } from "@/constants/queryKeys";

export function useUser(apiBaseUrl: string, userId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.users.detail(apiBaseUrl, userId ?? ""),
    queryFn: () => {
      if (!userId) {
        throw new Error("Пользователь не найден");
      }

      return fetchUser(apiBaseUrl, userId);
    },
    enabled: Boolean(userId),
  });
}
