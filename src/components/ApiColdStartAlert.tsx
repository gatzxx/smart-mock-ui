import { LoaderCircle } from "lucide-react";
import { memo } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { API_COLD_START_WAIT_HINT_SECONDS } from "@/constants/apiAvailability";
import { useApiAvailability } from "@/providers/ApiAvailabilityProvider";

export const ApiColdStartAlert = memo(function ApiColdStartAlert() {
  const { status } = useApiAvailability();

  const title = status === "checking" ? "Загружаем данные с API" : "API ещё не готов";

  return (
    <Alert
      className="border-primary/20 bg-primary/5 text-foreground"
      data-testid="api-cold-start-alert"
    >
      <LoaderCircle aria-hidden="true" className="size-4 animate-spin text-primary" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p>
          Сервер mock API может просыпаться до {API_COLD_START_WAIT_HINT_SECONDS} секунд
          после простоя. Создание и редактирование временно недоступны.
        </p>
      </AlertDescription>
    </Alert>
  );
});
