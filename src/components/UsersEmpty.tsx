import { memo } from "react";

export const UsersEmpty = memo(function UsersEmpty() {
  return (
    <div className="users-empty" data-testid="users-empty">
      <p>Пользователи не найдены</p>
    </div>
  );
});
