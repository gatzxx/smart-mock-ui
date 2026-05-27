import { memo, type ReactNode } from "react";

import { ApiActivityProvider } from "@/providers/ApiActivityProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = memo(function AppProviders({
  children,
}: AppProvidersProps) {
  return <ApiActivityProvider>{children}</ApiActivityProvider>;
});
