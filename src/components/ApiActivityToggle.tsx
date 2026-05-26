import { Activity } from "lucide-react";
import { memo, useCallback } from "react";

import { Button } from "@/components/ui/button";

type ApiActivityToggleProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export const ApiActivityToggle = memo(function ApiActivityToggle({
  isOpen,
  onToggle,
}: ApiActivityToggleProps) {
  const handleClick = useCallback(() => {
    onToggle();
  }, [onToggle]);

  return (
    <Button
      aria-expanded={isOpen}
      data-testid="api-activity-toggle"
      size="sm"
      type="button"
      variant={isOpen ? "default" : "outline"}
      onClick={handleClick}
    >
      <Activity aria-hidden="true" className="size-4" />
      API Activity
    </Button>
  );
});
