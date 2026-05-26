import { memo, type ReactNode } from "react";
import { Toaster } from "sonner";

import { useTheme } from "@/hooks/useTheme";
import { ApiActivityProvider } from "@/providers/ApiActivityProvider";

type AppProvidersProps = {
  children: ReactNode;
};

export const AppProviders = memo(function AppProviders({ children }: AppProvidersProps) {
  const { isDark } = useTheme();

  return (
    <ApiActivityProvider>
      {children}
      <Toaster closeButton position="top-right" theme={isDark ? "dark" : "light"} />
    </ApiActivityProvider>
  );
});
