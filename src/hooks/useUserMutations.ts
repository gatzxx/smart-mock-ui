import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

import {
  createUser,
  deleteUser,
  updateUser,
  type CreateUserInput,
  type UpdateUserInput,
} from "@/api/usersApi";
import {
  USER_CREATED_TOAST_MESSAGE,
  USER_DELETED_TOAST_MESSAGE,
  USER_UPDATED_TOAST_MESSAGE,
} from "@/constants/toast";
import { queryKeys } from "@/constants/queryKeys";
import {
  syncListAfterCreate,
  syncListAfterDelete,
  syncListAfterUpdate,
  toUserListItem,
} from "@/lib/listQueryCache";

type UpdateUserMutationInput = {
  userId: string;
  input: UpdateUserInput;
};

export function useUserMutations(apiBaseUrl: string) {
  const queryClient = useQueryClient();

  const usersQueryKey = useMemo(() => queryKeys.users.all(apiBaseUrl), [apiBaseUrl]);

  const invalidateUserDetail = useCallback(
    (userId: string) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.users.detail(apiBaseUrl, userId),
      });
    },
    [apiBaseUrl, queryClient],
  );

  const createMutation = useMutation({
    mutationFn: (input: CreateUserInput) => createUser(apiBaseUrl, input),
    onSuccess: (createdUser) => {
      syncListAfterCreate(queryClient, usersQueryKey, toUserListItem(createdUser));
      toast.success(USER_CREATED_TOAST_MESSAGE);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, input }: UpdateUserMutationInput) =>
      updateUser(apiBaseUrl, userId, input),
    onSuccess: (updatedUser) => {
      invalidateUserDetail(updatedUser.id);
      syncListAfterUpdate(queryClient, usersQueryKey, toUserListItem(updatedUser));
      toast.success(USER_UPDATED_TOAST_MESSAGE);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => deleteUser(apiBaseUrl, userId),
    onSuccess: (_result, userId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.users.detail(apiBaseUrl, userId),
      });
      syncListAfterDelete(queryClient, usersQueryKey, userId);
      toast.success(USER_DELETED_TOAST_MESSAGE);
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
