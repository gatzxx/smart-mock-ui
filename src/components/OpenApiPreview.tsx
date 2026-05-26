import { memo, useCallback, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOpenApi } from "@/hooks/useOpenApi";
import { buildApiUrl } from "@/lib/metaCurl";

type OpenApiPreviewProps = {
  apiBaseUrl: string;
  openapiPath: string;
};

export const OpenApiPreview = memo(function OpenApiPreview({
  apiBaseUrl,
  openapiPath,
}: OpenApiPreviewProps) {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const { data, isPending, isError, error } = useOpenApi(
    apiBaseUrl,
    openapiPath,
    isPreviewOpen,
  );

  const openApiUrl = useMemo(
    () => buildApiUrl(apiBaseUrl, openapiPath),
    [apiBaseUrl, openapiPath],
  );

  const handleTogglePreview = useCallback(() => {
    setIsPreviewOpen((currentIsOpen) => !currentIsOpen);
  }, []);

  const errorMessage = useMemo(() => {
    if (error instanceof Error) {
      return error.message;
    }

    return "Не удалось загрузить OpenAPI spec";
  }, [error]);

  return (
    <Card data-testid="openapi-preview">
      <CardHeader>
        <CardTitle>OpenAPI</CardTitle>
        <CardDescription>
          Machine-readable contract:{" "}
          <a
            className="font-medium text-primary underline-offset-4 hover:underline"
            href={openApiUrl}
            rel="noreferrer"
            target="_blank"
          >
            {openapiPath}
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button size="sm" type="button" variant="outline" onClick={handleTogglePreview}>
          {isPreviewOpen ? "Скрыть JSON" : "Показать JSON"}
        </Button>
        {isPreviewOpen && isPending ? <Skeleton className="h-40 w-full" /> : null}
        {isPreviewOpen && isError ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}
        {isPreviewOpen && data ? (
          <pre className="max-h-96 overflow-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : null}
      </CardContent>
    </Card>
  );
});
