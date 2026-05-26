import { Copy } from "lucide-react";
import { memo, useCallback } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { CURL_COPIED_TOAST_MESSAGE } from "@/constants/toast";
import { buildCurlCommand } from "@/lib/metaCurl";
import type { ApiMetaRoute } from "@/types/apiMeta";

type MetaEndpointRowProps = {
  apiBaseUrl: string;
  route: ApiMetaRoute;
};

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
  route,
}: MetaEndpointRowProps) {
  const handleCopyCurl = useCallback(async () => {
    const curlCommand = buildCurlCommand(apiBaseUrl, route.method, route.path);

    try {
      await navigator.clipboard.writeText(curlCommand);
      toast.success(CURL_COPIED_TOAST_MESSAGE);
    } catch {
      toast.error("Не удалось скопировать curl");
    }
  }, [apiBaseUrl, route.method, route.path]);

  return (
    <TableRow data-testid={`meta-route-${route.method}-${route.path}`}>
      <TableCell className="font-mono text-xs">{route.path}</TableCell>
      <TableCell>
        <Badge variant={getMethodBadgeVariant(route.method)}>{route.method}</Badge>
      </TableCell>
      <TableCell className="text-right">
        <Button size="sm" type="button" variant="outline" onClick={handleCopyCurl}>
          <Copy aria-hidden="true" className="size-3.5" />
          curl
        </Button>
      </TableCell>
    </TableRow>
  );
});
