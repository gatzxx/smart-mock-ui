import { memo } from "react";

import type { User } from "../types/user";

type UserTableProps = {
  users: User[];
};

type UserRowProps = {
  user: User;
};

const UserRow = memo(function UserRow({ user }: UserRowProps) {
  return (
    <tr>
      <td>{user.fullName}</td>
      <td>{user.email}</td>
      <td>{user.role}</td>
    </tr>
  );
});

export const UserTable = memo(function UserTable({ users }: UserTableProps) {
  return (
    <table className="user-table" data-testid="user-table">
      <thead>
        <tr>
          <th>Имя</th>
          <th>Email</th>
          <th>Роль</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </tbody>
    </table>
  );
});
