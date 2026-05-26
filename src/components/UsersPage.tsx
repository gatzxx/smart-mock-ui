import { memo, useMemo } from "react";

import { SearchEmpty } from "@/components/SearchEmpty";
import { TableSearchField } from "@/components/TableSearchField";
import { UserTable } from "@/components/UserTable";
import { UsersEmpty } from "@/components/UsersEmpty";
import { UsersError } from "@/components/UsersError";
import { UsersSkeleton } from "@/components/UsersSkeleton";
import { useClientSearch } from "@/hooks/useClientSearch";
import { useRefetchWithToast } from "@/hooks/useRefetchWithToast";
import { useUsers } from "@/hooks/useUsers";
import type { User } from "@/types/user";

const USERS_SEARCH_PLACEHOLDER = "Поиск по имени, email или роли";

function getUserSearchText(user: User): string {
  return `${user.fullName} ${user.email} ${user.role}`;
}

export const UsersPage = memo(function UsersPage() {
  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    [],
  );

  const { data, isPending, isError, error, refetch } = useUsers(apiBaseUrl);

  const { query, setQuery, filteredItems } = useClientSearch(
    data ?? [],
    getUserSearchText,
  );

  const handleRetry = useRefetchWithToast(refetch);

  const errorMessage = useMemo(() => {
    if (error instanceof Error) {
      return error.message;
    }
    return "Не удалось загрузить данные";
  }, [error]);

  if (isPending) {
    return <UsersSkeleton />;
  }

  if (isError) {
    return <UsersError message={errorMessage} onRetry={handleRetry} />;
  }

  if (!data || data.length === 0) {
    return <UsersEmpty />;
  }

  return (
    <div>
      <TableSearchField
        placeholder={USERS_SEARCH_PLACEHOLDER}
        testId="users-search"
        value={query}
        onChange={setQuery}
      />
      {filteredItems.length === 0 ? (
        <SearchEmpty
          description="Попробуйте изменить запрос."
          testId="users-search-empty"
          title="Ничего не найдено"
        />
      ) : (
        <UserTable users={filteredItems} />
      )}
    </div>
  );
});
