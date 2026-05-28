import { Activity, X } from "lucide-react";
import { memo, useCallback, useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApiActivity } from "@/providers/ApiActivityProvider";
import type { ApiActivityEntry } from "@/types/apiActivity";

function formatRequestPath(url: string): string {
  try {
    return new URL(url).pathname;
  } catch {
    return url;
  }
}

function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

type ApiActivityRowProps = {
  entry: ApiActivityEntry;
};

const ApiActivityRow = memo(function ApiActivityRow({ entry }: ApiActivityRowProps) {
  const statusLabel = useMemo(() => {
    if (entry.status === null) {
      return "ERR";
    }

    return String(entry.status);
  }, [entry.status]);

  return (
    <TableRow>
      <TableCell className="font-mono text-xs">{entry.method}</TableCell>
      <TableCell className="max-w-xs truncate font-mono text-xs">
        {formatRequestPath(entry.url)}
      </TableCell>
      <TableCell>
        <Badge
          className={entry.ok ? undefined : "border-destructive/30 text-destructive"}
          variant={entry.ok ? "success" : "outline"}
        >
          {statusLabel}
        </Badge>
      </TableCell>
      <TableCell className="tabular-nums">{entry.durationMs} ms</TableCell>
      <TableCell className="text-muted-foreground">
        {formatTimestamp(entry.timestamp)}
      </TableCell>
    </TableRow>
  );
});

type ApiActivityPanelProps = {
  onClose: () => void;
};

export const ApiActivityPanel = memo(function ApiActivityPanel({
  onClose,
}: ApiActivityPanelProps) {
  const { clearActivities, entries } = useApiActivity();

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleClear = useCallback(() => {
    clearActivities();
  }, [clearActivities]);

  const rows = useMemo(
    () => entries.map((entry) => <ApiActivityRow key={entry.id} entry={entry} />),
    [entries],
  );

  return (
    <Card
      className="rounded-none border-x-0 border-t-0 border-b-0 shadow-none"
      data-testid="api-activity-panel"
    >
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Activity aria-hidden="true" className="size-4" />
            API Activity
          </CardTitle>
          <CardDescription>
            Лог последних запросов UI к mock-api: статус, latency, retry.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Button size="sm" type="button" variant="outline" onClick={handleClear}>
            Очистить
          </Button>
          <Button
            aria-label="Закрыть панель API Activity"
            size="sm"
            type="button"
            variant="ghost"
            onClick={handleClose}
          >
            <X aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground" data-testid="api-activity-empty">
            Запросов пока нет. Откройте Users, Products или Meta.
          </p>
        ) : (
          <Table data-testid="api-activity-table">
            <TableHeader>
              <TableRow>
                <TableHead>Метод</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Время</TableHead>
                <TableHead>Когда</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{rows}</TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
});
