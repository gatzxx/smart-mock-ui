import { memo } from "react";
import { Toaster } from "sonner";

import { useTheme } from "@/providers/ThemeProvider";

export const ThemedToaster = memo(function ThemedToaster() {
  const { isDark } = useTheme();

  return (
    <Toaster closeButton position="top-right" theme={isDark ? "dark" : "light"} />
  );
});
