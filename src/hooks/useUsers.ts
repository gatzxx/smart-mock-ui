import { useQuery } from "@tanstack/react-query";

import { fetchUsers } from "../api/usersApi";

const USERS_QUERY_KEY = "users";

export function useUsers(apiBaseUrl: string) {
  return useQuery({
    queryKey: [USERS_QUERY_KEY, apiBaseUrl],
    queryFn: () => fetchUsers(apiBaseUrl),
  });
}
