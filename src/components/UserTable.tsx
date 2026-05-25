import { memo } from "react";
import { Link } from "react-router-dom";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/types/user";

type UserTableProps = {
  users: User[];
};

type UserRowProps = {
  user: User;
};

const UserRow = memo(function UserRow({ user }: UserRowProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <Link
          className="text-primary underline-offset-4 hover:underline"
          to={`/users/${user.id}`}
        >
          {user.fullName}
        </Link>
      </TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>{user.role}</TableCell>
    </TableRow>
  );
});

export const UserTable = memo(function UserTable({ users }: UserTableProps) {
  return (
    <Table data-testid="user-table">
      <TableHeader>
        <TableRow>
          <TableHead>Имя</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Роль</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </TableBody>
    </Table>
  );
});
