import { Copy } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { JSON_COPIED_TOAST_MESSAGE } from "@/constants/toast";
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

  const formattedJson = useMemo(() => {
    if (!data) {
      return "";
    }

    return JSON.stringify(data, null, 2);
  }, [data]);

  const handleCopyJson = useCallback(async () => {
    if (!formattedJson) {
      return;
    }

    try {
      await navigator.clipboard.writeText(formattedJson);
      toast.success(JSON_COPIED_TOAST_MESSAGE);
    } catch {
      toast.error("Не удалось скопировать JSON");
    }
  }, [formattedJson]);

  const errorMessage = useMemo(() => {
    if (error instanceof Error) {
      return error.message;
    }

    return "Не удалось загрузить OpenAPI-спецификацию";
  }, [error]);

  return (
    <Card data-testid="openapi-preview">
      <CardHeader>
        <CardTitle>OpenAPI</CardTitle>
        <CardDescription>
          Контракт в машиночитаемом формате:{" "}
          <a
            className="pressable-link font-medium text-primary underline-offset-4 hover:underline"
            href={openApiUrl}
            rel="noreferrer"
            target="_blank"
          >
            {openapiPath}
          </a>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            type="button"
            variant="outline"
            onClick={handleTogglePreview}
          >
            {isPreviewOpen ? "Скрыть JSON" : "Показать JSON"}
          </Button>
          {isPreviewOpen && data ? (
            <Button size="sm" type="button" variant="outline" onClick={handleCopyJson}>
              <Copy aria-hidden="true" className="size-3.5" />
              Копировать
            </Button>
          ) : null}
        </div>
        {isPreviewOpen && isPending ? <Skeleton className="h-40 w-full" /> : null}
        {isPreviewOpen && isError ? (
          <p className="text-sm text-destructive">{errorMessage}</p>
        ) : null}
        {isPreviewOpen && formattedJson ? (
          <pre className="max-h-96 overflow-auto rounded-md bg-muted p-3 text-xs leading-relaxed">
            {formattedJson}
          </pre>
        ) : null}
      </CardContent>
    </Card>
  );
});
