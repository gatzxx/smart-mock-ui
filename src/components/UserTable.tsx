import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

import { DataTable } from "@/components/DataTable";
import { UserRowActions } from "@/components/UserRowActions";
import type { User } from "@/types/user";

type UserTableProps = {
  apiBaseUrl: string;
  users: User[];
};

export const UserTable = memo(function UserTable({
  apiBaseUrl,
  users,
}: UserTableProps) {
  const getRowId = useCallback((user: User) => user.id, []);

  const columns = useMemo<ColumnDef<User, unknown>[]>(
    () => [
      {
        accessorKey: "fullName",
        header: "Имя",
        cell: ({ row }) => (
          <Link
            className="pressable-link font-medium text-primary underline-offset-4 hover:underline"
            to={`/users/${row.original.id}`}
          >
            {row.original.fullName}
          </Link>
        ),
      },
      {
        accessorKey: "email",
        header: "Email",
      },
      {
        accessorKey: "role",
        header: "Роль",
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Действия</span>,
        cell: ({ row }) => (
          <UserRowActions apiBaseUrl={apiBaseUrl} user={row.original} />
        ),
      },
    ],
    [apiBaseUrl],
  );

  return (
    <DataTable
      caption="Список пользователей"
      columns={columns}
      data={users}
      getRowId={getRowId}
      testId="user-table"
    />
  );
});
