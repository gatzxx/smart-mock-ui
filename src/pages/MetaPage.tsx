import { memo, useCallback, useMemo, useState } from "react";

import { MetaEndpointRow, getMetaRouteKey } from "@/components/MetaEndpointRow";
import { SortableColumnHeader } from "@/components/SortableColumnHeader";
import { OpenApiPreview } from "@/components/OpenApiPreview";
import { UsersError } from "@/components/UsersError";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApiBaseUrl } from "@/hooks/useApiBaseUrl";
import { useMeta } from "@/hooks/useMeta";
import { useRefetchWithToast } from "@/hooks/useRefetchWithToast";
import { normalizeMetaRoutes } from "@/lib/metaCurl";
import {
  getNextMetaRouteSortState,
  sortMetaRoutes,
  type MetaRouteSortField,
  type MetaRouteSortState,
} from "@/lib/sortMetaRoutes";

const MetaSkeleton = memo(function MetaSkeleton() {
  return (
    <Card data-testid="meta-skeleton">
      <CardHeader>
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-64" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-32 w-full" />
      </CardContent>
    </Card>
  );
});

export const MetaPage = memo(function MetaPage() {
  const apiBaseUrl = useApiBaseUrl();
  const { data, isPending, isError, error, refetch } = useMeta(apiBaseUrl);

  const handleRetry = useRefetchWithToast(refetch);

  const errorMessage = useMemo(() => {
    if (error instanceof Error) {
      return error.message;
    }

    return "Не удалось загрузить данные";
  }, [error]);

  const routes = useMemo(() => {
    if (!data) {
      return [];
    }

    return normalizeMetaRoutes(data);
  }, [data]);

  const [expandedRouteKey, setExpandedRouteKey] = useState<string | null>(null);
  const [sortState, setSortState] = useState<MetaRouteSortState | null>(null);

  const handleToggleRoute = useCallback((routeKey: string) => {
    setExpandedRouteKey((currentRouteKey) =>
      currentRouteKey === routeKey ? null : routeKey,
    );
  }, []);

  const handleSort = useCallback((field: MetaRouteSortField) => {
    setSortState((currentSortState) =>
      getNextMetaRouteSortState(currentSortState, field),
    );
  }, []);

  const sortedRoutes = useMemo(
    () => sortMetaRoutes(routes, sortState),
    [routes, sortState],
  );

  if (isPending) {
    return <MetaSkeleton />;
  }

  if (isError) {
    return <UsersError message={errorMessage} onRetry={handleRetry} />;
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Meta API</h2>
        <p className="text-sm text-muted-foreground">
          Discovery mock-api: маршруты, curl и OpenAPI-спецификация
        </p>
      </div>

      <Card data-testid="meta-page">
        <CardHeader>
          <CardTitle>Сводка</CardTitle>
          <CardDescription>
            Discovery-эндпoинт mock-api:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /__meta</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Badge variant="secondary">Базовый путь: {data.basePath}</Badge>
          <Badge variant="secondary">Задержка: {data.responseDelayMs} мс</Badge>
          <Badge variant="secondary">
            {routes.length}{" "}
            {routes.length === 1
              ? "маршрут"
              : routes.length < 5
                ? "маршрута"
                : "маршрутов"}
          </Badge>
          {data.schemaVersion !== undefined ? (
            <Badge variant="secondary">Версия схемы: {data.schemaVersion}</Badge>
          ) : null}
        </CardContent>
      </Card>

      {data.openapiPath ? (
        <OpenApiPreview apiBaseUrl={apiBaseUrl} openapiPath={data.openapiPath} />
      ) : null}

      <Card data-testid="meta-endpoints-table">
        <CardHeader>
          <CardTitle className="text-base">Маршруты</CardTitle>
          <CardDescription>
            Метод, путь и просмотр curl для каждого эндпoинта
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead scope="col">
                  <SortableColumnHeader
                    label="Путь"
                    sortDirection={
                      sortState?.field === "path" ? sortState.direction : false
                    }
                    sortLabel="Путь"
                    onSort={() => {
                      handleSort("path");
                    }}
                  />
                </TableHead>
                <TableHead scope="col">
                  <SortableColumnHeader
                    label="Метод"
                    sortDirection={
                      sortState?.field === "method" ? sortState.direction : false
                    }
                    sortLabel="Метод"
                    onSort={() => {
                      handleSort("method");
                    }}
                  />
                </TableHead>
                <TableHead className="text-right" scope="col">
                  Действия
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRoutes.map((route) => {
                const routeKey = getMetaRouteKey(route);

                return (
                  <MetaEndpointRow
                    key={routeKey}
                    apiBaseUrl={apiBaseUrl}
                    isExpanded={expandedRouteKey === routeKey}
                    route={route}
                    onToggle={() => {
                      handleToggleRoute(routeKey);
                    }}
                  />
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
});
