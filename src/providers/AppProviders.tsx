import { memo, type ReactNode } from "react";

import { ApiActivityProvider } from "@/providers/ApiActivityProvider";
import { ApiAvailabilityProvider } from "@/providers/ApiAvailabilityProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = memo(function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <ApiAvailabilityProvider>
      <ApiActivityProvider>{children}</ApiActivityProvider>
    </ApiAvailabilityProvider>
  );
});
