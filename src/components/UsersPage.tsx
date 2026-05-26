import { Plus } from "lucide-react";
import { memo, useMemo } from "react";
import { Link } from "react-router-dom";

import { SearchEmpty } from "@/components/SearchEmpty";
import { TableSearchField } from "@/components/TableSearchField";
import { UserTable } from "@/components/UserTable";
import { UsersEmpty } from "@/components/UsersEmpty";
import { UsersError } from "@/components/UsersError";
import { UsersSkeleton } from "@/components/UsersSkeleton";
import { Button } from "@/components/ui/button";
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";
import { useClientSearch } from "@/hooks/useClientSearch";
import { useRefetchWithToast } from "@/hooks/useRefetchWithToast";
import { useUsers } from "@/hooks/useUsers";
import type { User } from "@/types/user";

const USERS_SEARCH_PLACEHOLDER = "Поиск по имени, email или роли";

function getUserSearchText(user: User): string {
  return `${user.fullName} ${user.email} ${user.role}`;
}

export const UsersPage = memo(function UsersPage() {
  const apiBaseUrl = useApiBaseUrl();
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

  const pageHeader = (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Пользователи</h2>
        <p className="text-sm text-muted-foreground">
          CRUD demo: создание, редактирование и удаление через mock API
        </p>
      </div>
      <Button asChild>
        <Link to="/users/new">
          <Plus aria-hidden="true" className="size-4" />
          Пользователь
        </Link>
      </Button>
    </div>
  );

  if (isPending) {
    return (
      <div>
        {pageHeader}
        <UsersSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        {pageHeader}
        <UsersError message={errorMessage} onRetry={handleRetry} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div>
        {pageHeader}
        <UsersEmpty />
      </div>
    );
  }

  return (
    <div>
      {pageHeader}
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
        <UserTable apiBaseUrl={apiBaseUrl} users={filteredItems} />
      )}
    </div>
  );
});
