import { memo } from "react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const UsersEmpty = memo(function UsersEmpty() {
  return (
    <Card data-testid="users-empty">
      <CardHeader className="text-center">
        <CardTitle>Пользователи не найдены</CardTitle>
        <CardDescription>API вернул пустой список.</CardDescription>
      </CardHeader>
    </Card>
  );
});
