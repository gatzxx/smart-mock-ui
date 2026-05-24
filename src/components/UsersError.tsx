import { memo, useCallback } from "react";

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
    <div className="users-error" data-testid="users-error">
      <p>{message}</p>
      <button type="button" onClick={handleRetryClick}>
        Повторить
      </button>
    </div>
  );
});
