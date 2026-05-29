import { Activity, RefreshCw } from "lucide-react";
import { memo, useMemo } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useRefetchWithToast } from "@/hooks/useRefetchWithToast";
import { useApiAvailability } from "@/providers/ApiAvailabilityProvider";

export const ApiHealthBadge = memo(function ApiHealthBadge() {
  const { isFetching, refetch, status } = useApiAvailability();

  const handleRetry = useRefetchWithToast(refetch);

  const badgeContent = useMemo(() => {
    if (status === "checking") {
      return (
        <Badge className="gap-1.5" data-testid="api-health-badge" variant="muted">
          <Activity aria-hidden="true" className="size-3" />
          Проверка API...
        </Badge>
      );
    }

    if (status === "waking") {
      return (
        <Badge className="gap-1.5" data-testid="api-health-badge" variant="muted">
          <Activity aria-hidden="true" className="size-3 animate-pulse" />
          API просыпается...
        </Badge>
      );
    }

    if (status === "offline") {
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
  }, [status]);

  return (
    <div className="flex items-center gap-2">
      {badgeContent}
      {status === "offline" ? (
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
