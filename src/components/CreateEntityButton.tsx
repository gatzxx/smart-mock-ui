import { Plus } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useApiAvailability } from "@/providers/ApiAvailabilityProvider";

type CreateEntityButtonProps = {
  label: string;
  testId?: string;
  to: string;
};

export const CreateEntityButton = memo(function CreateEntityButton({
  label,
  testId,
  to,
}: CreateEntityButtonProps) {
  const { isApiReady } = useApiAvailability();

  const content = (
    <>
      <Plus aria-hidden="true" className="size-4" />
      {label}
    </>
  );

  if (!isApiReady) {
    return (
      <Button data-testid={testId} disabled title="Дождитесь запуска API" type="button">
        {content}
      </Button>
    );
  }

  return (
    <Button asChild data-testid={testId}>
      <Link to={to}>{content}</Link>
    </Button>
  );
});
