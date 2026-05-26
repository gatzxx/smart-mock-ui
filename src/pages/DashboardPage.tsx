import { Activity, Package, Users } from "lucide-react";
import { memo, useMemo } from "react";

import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { DashboardStatCard } from "@/components/DashboardStatCard";
import { UsersError } from "@/components/UsersError";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRefetchAllWithToast } from "@/hooks/useRefetchWithToast";
import { formatHealthTimestamp, formatUptimeSeconds } from "@/lib/formatHealth";

export const DashboardPage = memo(function DashboardPage() {
  const apiBaseUrl = useApiBaseUrl();

  const {
    usersCount,
    productsCount,
    healthQuery,
    isPending,
    isError,
    error,
    refetchAll,
  } = useDashboardStats(apiBaseUrl);

  const handleRetry = useRefetchAllWithToast(refetchAll);

  const errorMessage = useMemo(() => {
    if (error instanceof Error) {
      return error.message;
    }
    return "Не удалось загрузить данные";
  }, [error]);

  const healthCardValue = useMemo(() => {
    if (healthQuery.isPending) {
      return "…";
    }

    if (healthQuery.isError || healthQuery.data?.status !== "ok") {
      return "Ошибка";
    }

    return "Online";
  }, [healthQuery.data?.status, healthQuery.isError, healthQuery.isPending]);

  const healthCardDescription = useMemo(() => {
    if (healthQuery.isPending) {
      return "Проверяем GET /api/health...";
    }

    if (healthQuery.isError) {
      return "Mock API не отвечает. Попробуйте обновить страницу.";
    }

    if (healthQuery.data?.status === "ok") {
      return `Uptime: ${formatUptimeSeconds(healthQuery.data.uptime)} · ${formatHealthTimestamp(healthQuery.data.timestamp)}`;
    }

    return "Статус API отличен от ok.";
  }, [healthQuery.data, healthQuery.isError, healthQuery.isPending]);

  if (isPending) {
    return <DashboardSkeleton />;
  }

  if (isError) {
    return <UsersError message={errorMessage} onRetry={handleRetry} />;
  }

  return (
    <div className="space-y-4" data-testid="dashboard-page">
      <Card>
        <CardHeader>
          <CardTitle>Обзор</CardTitle>
          <CardDescription>
            Сводка по mock API и демо-данным админки.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Badge variant="secondary">live demo</Badge>
          <Badge variant="secondary">Live CRUD demo</Badge>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardStatCard
          description="Список из GET /api/users"
          href="/users"
          icon={Users}
          testId="dashboard-users-card"
          title="Пользователи"
          value={String(usersCount)}
        />
        <DashboardStatCard
          description="Каталог из GET /api/products"
          href="/products"
          icon={Package}
          testId="dashboard-products-card"
          title="Товары"
          value={String(productsCount)}
        />
        <DashboardStatCard
          description={healthCardDescription}
          icon={Activity}
          testId="dashboard-health-card"
          title="Статус API"
          value={healthCardValue}
        />
      </div>
    </div>
  );
});
