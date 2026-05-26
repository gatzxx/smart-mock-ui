import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

import {
  createProduct,
  deleteProduct,
  updateProduct,
  type CreateProductInput,
  type UpdateProductInput,
} from "@/api/productsApi";
import {
  PRODUCT_CREATED_TOAST_MESSAGE,
  PRODUCT_DELETED_TOAST_MESSAGE,
  PRODUCT_UPDATED_TOAST_MESSAGE,
} from "@/constants/toast";
import { queryKeys } from "@/constants/queryKeys";
import {
  syncListAfterCreate,
  syncListAfterDelete,
  syncListAfterUpdate,
  toProductListItem,
} from "@/lib/listQueryCache";

type UpdateProductMutationInput = {
  productId: string;
  input: UpdateProductInput;
};

export function useProductMutations(apiBaseUrl: string) {
  const queryClient = useQueryClient();

  const productsQueryKey = useMemo(
    () => queryKeys.products.all(apiBaseUrl),
    [apiBaseUrl],
  );

  const invalidateProductDetail = useCallback(
    (productId: string) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(apiBaseUrl, productId),
      });
    },
    [apiBaseUrl, queryClient],
  );

  const createMutation = useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(apiBaseUrl, input),
    onSuccess: (createdProduct) => {
      syncListAfterCreate(
        queryClient,
        productsQueryKey,
        toProductListItem(createdProduct),
      );
      toast.success(PRODUCT_CREATED_TOAST_MESSAGE);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, input }: UpdateProductMutationInput) =>
      updateProduct(apiBaseUrl, productId, input),
    onSuccess: (updatedProduct) => {
      invalidateProductDetail(updatedProduct.id);
      syncListAfterUpdate(
        queryClient,
        productsQueryKey,
        toProductListItem(updatedProduct),
      );
      toast.success(PRODUCT_UPDATED_TOAST_MESSAGE);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(apiBaseUrl, productId),
    onSuccess: (_result, productId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.products.detail(apiBaseUrl, productId),
      });
      syncListAfterDelete(queryClient, productsQueryKey, productId);
      toast.success(PRODUCT_DELETED_TOAST_MESSAGE);
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
