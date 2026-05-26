import { useQuery } from "@tanstack/react-query";

import { fetchUsers } from "@/api/usersApi";
import { queryKeys } from "@/constants/queryKeys";

export function useUsers(apiBaseUrl: string) {
  return useQuery({
    queryKey: queryKeys.users.all(apiBaseUrl),
    queryFn: () => fetchUsers(apiBaseUrl),
    refetchOnMount: true,
  });
}
