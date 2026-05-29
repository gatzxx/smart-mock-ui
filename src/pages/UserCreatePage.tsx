import { memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { ApiColdStartAlert } from "@/components/ApiColdStartAlert";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/Breadcrumbs";
import { UserForm } from "@/components/UserForm";
import { UsersError } from "@/components/UsersError";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";
import { useFormCancelNavigation } from "@/hooks/useFormCancelNavigation";
import { useRefetchWithToast } from "@/hooks/useRefetchWithToast";
import { useUserMutations } from "@/hooks/useUserMutations";
import type { UserFormValues } from "@/lib/userFormSchema";
import { useApiAvailability } from "@/providers/ApiAvailabilityProvider";

const breadcrumbItems: BreadcrumbItem[] = [
  { label: "Пользователи", href: "/users" },
  { label: "Новый пользователь" },
];

export const UserCreatePage = memo(function UserCreatePage() {
  const apiBaseUrl = useApiBaseUrl();
  const navigate = useNavigate();
  const { createMutation } = useUserMutations(apiBaseUrl);
  const handleCancel = useFormCancelNavigation("/users");
  const { isApiReady, isApiWaking, refetch } = useApiAvailability();
  const handleRetry = useRefetchWithToast(refetch);

  const handleSubmit = useCallback(
    (values: UserFormValues) => {
      createMutation.mutate(values, {
        onSuccess: (createdUser) => {
          navigate(`/users/${createdUser.id}`);
        },
      });
    },
    [createMutation, navigate],
  );

  if (!isApiReady) {
    return (
      <div className="mx-auto max-w-xl space-y-4">
        <Breadcrumbs items={breadcrumbItems} testId="user-create-breadcrumbs" />
        {isApiWaking ? (
          <ApiColdStartAlert />
        ) : (
          <UsersError
            message="Mock API недоступен. Создание пользователя временно невозможно."
            onRetry={handleRetry}
          />
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Breadcrumbs items={breadcrumbItems} testId="user-create-breadcrumbs" />
      <Card data-testid="user-create-page">
        <CardHeader>
          <CardTitle>Новый пользователь</CardTitle>
          <CardDescription>
            POST /api/users: запись попадёт в in-memory store mock API
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserForm
            isSubmitting={createMutation.isPending}
            submitLabel="Создать"
            onCancel={handleCancel}
            onSubmit={handleSubmit}
          />
        </CardContent>
      </Card>
    </div>
  );
});
