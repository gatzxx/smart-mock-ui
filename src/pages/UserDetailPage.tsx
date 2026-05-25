import { memo, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";

import { UserDetailCard } from "@/components/UserDetailCard";
import { UserDetailSkeleton } from "@/components/UserDetailSkeleton";
import { UsersError } from "@/components/UsersError";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useUser } from "@/hooks/useUser";

export const UserDetailPage = memo(function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    [],
  );

  const { data, isPending, isError, error, refetch } = useUser(apiBaseUrl, id);

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const errorMessage = useMemo(() => {
    if (error instanceof Error) {
      return error.message;
    }
    return "Не удалось загрузить данные";
  }, [error]);

  if (!id) {
    return (
      <Card data-testid="user-detail-not-found">
        <CardHeader className="text-center">
          <CardTitle>Пользователь не найден</CardTitle>
          <CardDescription>Некорректный идентификатор в URL.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isPending) {
    return <UserDetailSkeleton />;
  }

  if (isError) {
    const isNotFound = errorMessage.includes("не найден");

    if (isNotFound) {
      return (
        <Card data-testid="user-detail-not-found">
          <CardHeader className="text-center">
            <CardTitle>Пользователь не найден</CardTitle>
            <CardDescription>Запись с id {id} недоступна.</CardDescription>
          </CardHeader>
        </Card>
      );
    }

    return <UsersError message={errorMessage} onRetry={handleRetry} />;
  }

  if (!data) {
    return (
      <Card data-testid="user-detail-not-found">
        <CardHeader className="text-center">
          <CardTitle>Пользователь не найден</CardTitle>
          <CardDescription>Данные отсутствуют.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return <UserDetailCard user={data} />;
});
