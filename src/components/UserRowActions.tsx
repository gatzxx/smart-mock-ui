import { memo, useCallback, useState } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { useUserMutations } from "@/hooks/useUserMutations";
import type { User } from "@/types/user";

type UserRowActionsProps = {
  apiBaseUrl: string;
  user: User;
};

export const UserRowActions = memo(function UserRowActions({
  apiBaseUrl,
  user,
}: UserRowActionsProps) {
  const { deleteMutation } = useUserMutations(apiBaseUrl);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteClick = useCallback(() => {
    setIsConfirmOpen(true);
  }, []);

  const handleCancelDelete = useCallback(() => {
    setIsConfirmOpen(false);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    deleteMutation.mutate(user.id, {
      onSettled: () => {
        setIsConfirmOpen(false);
      },
    });
  }, [deleteMutation, user.id]);

  return (
    <div className="flex items-center justify-end gap-2">
      <Button asChild size="sm" variant="outline">
        <Link to={`/users/${user.id}/edit`}>Изменить</Link>
      </Button>
      {isConfirmOpen ? (
        <div className="flex items-center gap-1">
          <Button
            disabled={deleteMutation.isPending}
            size="sm"
            variant="outline"
            onClick={handleConfirmDelete}
          >
            {deleteMutation.isPending ? "..." : "Да"}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleCancelDelete}>
            Нет
          </Button>
        </div>
      ) : (
        <Button size="sm" variant="ghost" onClick={handleDeleteClick}>
          Удалить
        </Button>
      )}
    </div>
  );
});
