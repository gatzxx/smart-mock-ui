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
    status === "checking"
      ? "Проверяем доступность API"
      : "API просыпается после простоя";

  return (
    <Alert
      className="mt-4 border-primary/20 bg-primary/5 text-foreground"
      data-testid="api-wakeup-banner"
    >
      <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-primary" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>
          Mock API на Render free tier может стартовать до{" "}
          {API_COLD_START_WAIT_HINT_SECONDS} секунд. Подождите — страница обновится
          автоматически.
        </p>
      </AlertDescription>
    </Alert>
  );
});
