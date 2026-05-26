import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

import {
  createUser,
  deleteUser,
  updateUser,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/api/usersApi";
import { queryKeys } from "@/constants/queryKeys";
import {
  USER_CREATED_TOAST_MESSAGE,
  USER_DELETED_TOAST_MESSAGE,
  USER_UPDATED_TOAST_MESSAGE,
} from "@/constants/toast";

type UpdateUserMutationInput = {
  userId: string;
  input: UpdateUserInput;
};

export function useUserMutations(apiBaseUrl: string) {
  const queryClient = useQueryClient();

  const invalidateUsers = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.users.all(apiBaseUrl),
    });
  }, [apiBaseUrl, queryClient]);

  const createMutation = useMutation({
    mutationFn: (input: CreateUserInput) => createUser(apiBaseUrl, input),
    onSuccess: () => {
      invalidateUsers();
      toast.success(USER_CREATED_TOAST_MESSAGE);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, input }: UpdateUserMutationInput) =>
      updateUser(apiBaseUrl, userId, input),
    onSuccess: (updatedUser) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(apiBaseUrl, updatedUser.id),
      });
      invalidateUsers();
      toast.success(USER_UPDATED_TOAST_MESSAGE);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(apiBaseUrl, userId),
    onSuccess: (_result, userId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.users.detail(apiBaseUrl, userId),
      });
      invalidateUsers();
      toast.success(USER_DELETED_TOAST_MESSAGE);
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
