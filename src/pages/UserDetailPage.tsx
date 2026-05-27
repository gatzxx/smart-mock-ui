import { memo, useMemo } from "react";
import { useParams } from "react-router-dom";

import { Breadcrumbs, type BreadcrumbItem } from "@/components/Breadcrumbs";
import { UserDetailCard } from "@/components/UserDetailCard";
import { UserDetailSkeleton } from "@/components/UserDetailSkeleton";
import { UsersError } from "@/components/UsersError";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";
import { useRefetchWithToast } from "@/hooks/useRefetchWithToast";
import { useUser } from "@/hooks/useUser";

export const UserDetailPage = memo(function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const apiBaseUrl = useApiBaseUrl();

  const { data, isPending, isError, error, refetch } = useUser(apiBaseUrl, id);

  const handleRetry = useRefetchWithToast(refetch);

  const errorMessage = useMemo(() => {
    if (error instanceof Error) {
      return error.message;
    }
    return "Не удалось загрузить данные";
  }, [error]);

  const breadcrumbItems = useMemo((): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [{ label: "Пользователи", href: "/users" }];

    if (isPending) {
      items.push({ label: "Загрузка..." });
      return items;
    }

    if (data) {
      items.push({ label: data.fullName });
      return items;
    }

    items.push({ label: id ?? "User" });
    return items;
  }, [data, id, isPending]);

  const breadcrumbNav = (
    <Breadcrumbs items={breadcrumbItems} testId="user-detail-breadcrumbs" />
  );

  if (!id) {
    return (
      <div>
        {breadcrumbNav}
        <Card data-testid="user-detail-not-found">
          <CardHeader className="text-center">
            <CardTitle>Пользователь не найден</CardTitle>
            <CardDescription>Некорректный идентификатор в URL.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isPending) {
    return (
      <div>
        {breadcrumbNav}
        <UserDetailSkeleton />
      </div>
    );
  }

  if (isError) {
    const isNotFound = errorMessage.includes("не найден");

    if (isNotFound) {
      return (
        <div>
          {breadcrumbNav}
          <Card data-testid="user-detail-not-found">
            <CardHeader className="text-center">
              <CardTitle>Пользователь не найден</CardTitle>
              <CardDescription>Запись с id {id} недоступна.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }

    return (
      <div>
        {breadcrumbNav}
        <UsersError message={errorMessage} onRetry={handleRetry} />
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        {breadcrumbNav}
        <Card data-testid="user-detail-not-found">
          <CardHeader className="text-center">
            <CardTitle>Пользователь не найден</CardTitle>
            <CardDescription>Данные отсутствуют.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {breadcrumbNav}
      <UserDetailCard user={data} />
    </div>
  );
});
