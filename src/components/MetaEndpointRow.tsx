import { ChevronRight, Copy } from "lucide-react";
import { memo, useCallback, useMemo, type KeyboardEvent, type MouseEvent } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { CURL_COPIED_TOAST_MESSAGE } from "@/constants/toast";
import { buildCurlCommand } from "@/lib/metaCurl";
import { cn } from "@/lib/utils";
import type { ApiMetaRoute } from "@/types/apiMeta";

type MetaEndpointRowProps = {
  apiBaseUrl: string;
  isExpanded: boolean;
  onToggle: () => void;
  route: ApiMetaRoute;
};

export function getMetaRouteKey(route: ApiMetaRoute): string {
  return `${route.method}-${route.path}`;
}

function getMethodBadgeVariant(
  method: string,
): "default" | "secondary" | "outline" | "muted" {
  switch (method.toUpperCase()) {
    case "POST":
      return "default";
    case "PATCH":
      return "outline";
    case "DELETE":
      return "muted";
    default:
      return "secondary";
  }
}

export const MetaEndpointRow = memo(function MetaEndpointRow({
  apiBaseUrl,
  isExpanded,
  onToggle,
  route,
}: MetaEndpointRowProps) {
  const curlCommand = useMemo(
    () => buildCurlCommand(apiBaseUrl, route.method, route.path),
    [apiBaseUrl, route.method, route.path],
  );

  const handleCopyCurl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(curlCommand);
      toast.success(CURL_COPIED_TOAST_MESSAGE);
    } catch {
      toast.error("Не удалось скопировать curl");
    }
  }, [curlCommand]);

  const handleRowClick = useCallback(() => {
    onToggle();
  }, [onToggle]);

  const handleRowKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTableRowElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onToggle();
      }
    },
    [onToggle],
  );

  const handleCopyClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      void handleCopyCurl();
    },
    [handleCopyCurl],
  );

  const handleToggleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.stopPropagation();
      onToggle();
    },
    [onToggle],
  );

  return (
    <>
      <TableRow
        aria-expanded={isExpanded}
        className="pressable cursor-pointer"
        data-testid={`meta-route-${route.method}-${route.path}`}
        tabIndex={0}
        onClick={handleRowClick}
        onKeyDown={handleRowKeyDown}
      >
        <TableCell className="font-mono text-xs">{route.path}</TableCell>
        <TableCell>
          <Badge variant={getMethodBadgeVariant(route.method)}>{route.method}</Badge>
        </TableCell>
        <TableCell className="text-right">
          <Button
            aria-expanded={isExpanded}
            aria-label={isExpanded ? "Скрыть curl" : "Показать curl"}
            size="sm"
            type="button"
            variant="outline"
            onClick={handleToggleClick}
          >
            <ChevronRight
              aria-hidden="true"
              className={cn(
                "size-3.5 transition-transform duration-150",
                isExpanded && "rotate-90",
              )}
            />
            curl
          </Button>
        </TableCell>
      </TableRow>
      {isExpanded ? (
        <TableRow data-testid={`meta-route-curl-${route.method}-${route.path}`}>
          <TableCell className="bg-muted/30 p-0" colSpan={3}>
            <div className="space-y-2 p-3">
              <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
                {curlCommand}
              </pre>
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={handleCopyClick}
              >
                <Copy aria-hidden="true" className="size-3.5" />
                Копировать
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
});
