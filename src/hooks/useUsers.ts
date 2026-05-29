import { useQuery } from "@tanstack/react-query";

import { fetchUsers } from "@/api/usersApi";
import { queryKeys } from "@/constants/queryKeys";

type UseUsersOptions = {
  enabled?: boolean;
};

export function useUsers(apiBaseUrl: string, options?: UseUsersOptions) {
  return useQuery({
    queryKey: queryKeys.users.all(apiBaseUrl),
    queryFn: () => fetchUsers(apiBaseUrl),
    enabled: options?.enabled ?? true,
    refetchOnMount: true,
  });
}
