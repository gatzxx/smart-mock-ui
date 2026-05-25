import { memo, useCallback, useMemo } from "react";

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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMeta } from "@/hooks/useMeta";

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
  const apiBaseUrl = useMemo(
    () => import.meta.env.VITE_API_URL ?? "http://localhost:3000",
    [],
  );

  const { data, isPending, isError, error, refetch } = useMeta(apiBaseUrl);

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const errorMessage = useMemo(() => {
    if (error instanceof Error) {
      return error.message;
    }
    return "Не удалось загрузить данные";
  }, [error]);

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
      <Card data-testid="meta-page">
        <CardHeader>
          <CardTitle>Meta API</CardTitle>
          <CardDescription>
            Discovery-эндпoинт mock-api:{" "}
            <code className="rounded bg-muted px-1.5 py-0.5 text-xs">GET /__meta</code>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Badge variant="secondary">basePath: {data.basePath}</Badge>
          <Badge variant="secondary">задержка: {data.responseDelayMs} мс</Badge>
          <Badge variant="secondary">{data.endpoints.length} эндпoинтов</Badge>
        </CardContent>
      </Card>

      <Table data-testid="meta-endpoints-table">
        <TableHeader>
          <TableRow>
            <TableHead>Эндпoинт</TableHead>
            <TableHead>Метод</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.endpoints.map((endpoint) => (
            <TableRow key={endpoint}>
              <TableCell className="font-mono text-xs">{endpoint}</TableCell>
              <TableCell>
                <Badge>GET</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
});
