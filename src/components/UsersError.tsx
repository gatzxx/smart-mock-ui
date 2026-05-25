import { AlertCircle } from "lucide-react";
import { memo, useCallback } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

type UsersErrorProps = {
  message: string;
  onRetry: () => void;
};

export const UsersError = memo(function UsersError({
  message,
  onRetry,
}: UsersErrorProps) {
  const handleRetryClick = useCallback(() => {
    onRetry();
  }, [onRetry]);

  return (
    <Alert data-testid="users-error" variant="destructive">
      <AlertCircle aria-hidden="true" className="size-4" />
      <AlertTitle>Ошибка загрузки</AlertTitle>
      <AlertDescription className="flex flex-col items-start gap-3">
        <p>{message}</p>
        <Button size="sm" type="button" variant="outline" onClick={handleRetryClick}>
          Повторить
        </Button>
      </AlertDescription>
    </Alert>
  );
});
