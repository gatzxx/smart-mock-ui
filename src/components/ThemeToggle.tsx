import { Moon, Sun } from "lucide-react";
import { memo, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export const ThemeToggle = memo(function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  const handleToggle = useCallback(() => {
    toggleTheme();
  }, [toggleTheme]);

  return (
    <Button
      aria-label={isDark ? "Включить светлую тему" : "Включить тёмную тему"}
      data-testid="theme-toggle"
      size="sm"
      type="button"
      variant="outline"
      onClick={handleToggle}
    >
      {isDark ? (
        <Sun aria-hidden="true" className="size-4" />
      ) : (
        <Moon aria-hidden="true" className="size-4" />
      )}
    </Button>
  );
});
