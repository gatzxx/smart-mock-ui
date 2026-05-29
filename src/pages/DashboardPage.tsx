import { Activity, Package, Users } from "lucide-react";
import { memo, useMemo } from "react";

import { ApiColdStartAlert } from "@/components/ApiColdStartAlert";
import { DashboardSkeleton } from "@/components/DashboardSkeleton";
import { DashboardStatCard } from "@/components/DashboardStatCard";
import { UsersError } from "@/components/UsersError";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { useRefetchAllWithToast } from "@/hooks/useRefetchWithToast";
import { formatHealthTimestamp, formatUptimeSeconds } from "@/lib/formatHealth";
import { useApiAvailability } from "@/providers/ApiAvailabilityProvider";

export const DashboardPage = memo(function DashboardPage() {
  const apiBaseUrl = useApiBaseUrl();
  const { healthData, status } = useApiAvailability();

  const {
    usersCount,
    productsCount,
    isApiWaking,
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
    if (status === "checking" || status === "waking") {
      return "…";
    }

    if (status === "offline") {
      return "Ошибка";
    }

    return "Online";
  }, [status]);

  const healthCardDescription = useMemo(() => {
    if (status === "checking") {
      return "Проверяем GET /api/health...";
    }

    if (status === "waking") {
      return "Mock API просыпается после простоя на Render.";
    }

    if (status === "offline") {
      return "Mock API не отвечает. Попробуйте обновить страницу.";
    }

    if (healthData?.status === "ok") {
      return `Uptime: ${formatUptimeSeconds(healthData.uptime)} · ${formatHealthTimestamp(healthData.timestamp)}`;
    }

    return "Статус API отличен от ok.";
  }, [healthData, status]);

  if (isApiWaking) {
    return (
      <div className="space-y-4" data-testid="dashboard-page">
        <Card>
          <CardHeader>
            <CardTitle>Обзор</CardTitle>
            <CardDescription>
              Сводка по mock API: списки users/products, health-check и CRUD через REST.
            </CardDescription>
          </CardHeader>
        </Card>
        <ApiColdStartAlert />
      </div>
    );
  }

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
            Сводка по mock API: списки users/products, health-check и CRUD через REST.
          </CardDescription>
        </CardHeader>
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
