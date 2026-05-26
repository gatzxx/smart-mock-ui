import { memo, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Breadcrumbs, type BreadcrumbItem } from "@/components/Breadcrumbs";
import { UserForm } from "@/components/UserForm";
import { UserDetailSkeleton } from "@/components/UserDetailSkeleton";
import { UsersError } from "@/components/UsersError";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";
import { useRefetchWithToast } from "@/hooks/useRefetchWithToast";
import { useUser } from "@/hooks/useUser";
import { useUserMutations } from "@/hooks/useUserMutations";
import type { UserFormValues } from "@/lib/userFormSchema";

export const UserEditPage = memo(function UserEditPage() {
  const { id } = useParams<{ id: string }>();
  const apiBaseUrl = useApiBaseUrl();
  const navigate = useNavigate();
  const { data, isPending, isError, error, refetch } = useUser(apiBaseUrl, id);
  const { updateMutation } = useUserMutations(apiBaseUrl);

  const handleRetry = useRefetchWithToast(refetch);

  const errorMessage = useMemo(() => {
    if (error instanceof Error) {
      return error.message;
    }

    return "Не удалось загрузить данные";
  }, [error]);

  const breadcrumbItems = useMemo((): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [{ label: "Пользователи", href: "/users" }];

    if (data) {
      items.push({ label: data.fullName, href: `/users/${data.id}` });
    } else {
      items.push({ label: id ?? "User" });
    }

    items.push({ label: "Редактирование" });
    return items;
  }, [data, id]);

  const defaultValues = useMemo((): UserFormValues | undefined => {
    if (!data) {
      return undefined;
    }

    return {
      fullName: data.fullName,
      email: data.email,
      role: data.role ?? "",
    };
  }, [data]);

  const handleSubmit = useCallback(
    (values: UserFormValues) => {
      if (!id) {
        return;
      }

      updateMutation.mutate(
        { userId: id, input: values },
        {
          onSuccess: (updatedUser) => {
            navigate(`/users/${updatedUser.id}`);
          },
        },
      );
    },
    [id, navigate, updateMutation],
  );

  const breadcrumbNav = (
    <Breadcrumbs items={breadcrumbItems} testId="user-edit-breadcrumbs" />
  );

  if (!id) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        {breadcrumbNav}
        <Card data-testid="user-edit-not-found">
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
      <div className="mx-auto max-w-xl space-y-4">
        {breadcrumbNav}
        <UserDetailSkeleton />
      </div>
    );
  }

  if (isError) {
    const isNotFound = errorMessage.includes("не найден");

    if (isNotFound) {
      return (
        <div className="mx-auto max-w-xl space-y-4">
          {breadcrumbNav}
          <Card data-testid="user-edit-not-found">
            <CardHeader className="text-center">
              <CardTitle>Пользователь не найден</CardTitle>
              <CardDescription>Запись с id {id} недоступна.</CardDescription>
            </CardHeader>
          </Card>
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-xl space-y-4">
        {breadcrumbNav}
        <UsersError message={errorMessage} onRetry={handleRetry} />
      </div>
    );
  }

  if (!data || !defaultValues) {
    return null;
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      {breadcrumbNav}
      <Card data-testid="user-edit-page">
        <CardHeader>
          <CardTitle>Редактирование</CardTitle>
          <CardDescription>
            PATCH /api/users/{id} : изменения сохраняются в store mock API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm
            defaultValues={defaultValues}
            isSubmitting={updateMutation.isPending}
            submitLabel="Сохранить"
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
});
