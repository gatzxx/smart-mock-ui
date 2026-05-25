import { Activity, RefreshCw } from "lucide-react";
import { memo, useCallback, useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHealth } from "@/hooks/useHealth";

type ApiHealthBadgeProps = {
  apiBaseUrl: string;
};

export const ApiHealthBadge = memo(function ApiHealthBadge({
  apiBaseUrl,
}: ApiHealthBadgeProps) {
  const { data, isPending, isError, refetch, isFetching } = useHealth(apiBaseUrl);

  const handleRetry = useCallback(() => {
    void refetch();
  }, [refetch]);

  const badgeContent = useMemo(() => {
    if (isPending) {
      return (
        <Badge className="gap-1.5" data-testid="api-health-badge" variant="muted">
          <Activity aria-hidden="true" className="size-3" />
          Проверка API...
        </Badge>
      );
    }

    if (isError || data?.status !== "ok") {
      return (
        <Badge
          className="gap-1.5 border-destructive/30 text-destructive"
          data-testid="api-health-badge"
          variant="outline"
        >
          <Activity aria-hidden="true" className="size-3" />
          API недоступен
        </Badge>
      );
    }

    return (
      <Badge className="gap-1.5" data-testid="api-health-badge" variant="success">
        <Activity aria-hidden="true" className="size-3" />
        API online
      </Badge>
    );
  }, [data?.status, isError, isPending]);

  return (
    <div className="flex items-center gap-2">
      {badgeContent}
      {(isError || data?.status !== "ok") && !isPending ? (
        <Button
          aria-label="Повторить проверку API"
          disabled={isFetching}
          size="sm"
          type="button"
          variant="ghost"
          onClick={handleRetry}
        >
          <RefreshCw
            aria-hidden="true"
            className={isFetching ? "size-4 animate-spin" : "size-4"}
          />
        </Button>
      ) : null}
    </div>
  );
});
