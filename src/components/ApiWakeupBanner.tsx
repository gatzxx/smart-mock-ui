import { LoaderCircle } from "lucide-react";
import { memo } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { API_COLD_START_WAIT_HINT_SECONDS } from "@/constants/apiAvailability";
import { useApiAvailability } from "@/providers/ApiAvailabilityProvider";

export const ApiWakeupBanner = memo(function ApiWakeupBanner() {
  const { isApiWaking, status } = useApiAvailability();

  if (!isApiWaking) {
    return null;
  }

  const title =
    status === "checking" ? "Подключаемся к mock API" : "Mock API просыпается";

  return (
    <Alert
      className="mt-4 border-primary/20 bg-primary/5 text-foreground"
      data-testid="api-wakeup-banner"
    >
      <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-primary" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>
          После простоя на Render free tier API может стартовать до{" "}
          {API_COLD_START_WAIT_HINT_SECONDS} секунд. Создание и редактирование временно
          недоступны. Подождите, страница обновится автоматически.
        </p>
      </AlertDescription>
    </Alert>
  );
});
