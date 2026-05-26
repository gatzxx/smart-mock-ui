import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { toast } from "sonner";

import {
  createProduct,
  deleteProduct,
  updateProduct,
  type CreateProductInput,
  type UpdateProductInput,
} from "@/api/productsApi";
import { queryKeys } from "@/constants/queryKeys";
import {
  PRODUCT_CREATED_TOAST_MESSAGE,
  PRODUCT_DELETED_TOAST_MESSAGE,
  PRODUCT_UPDATED_TOAST_MESSAGE,
} from "@/constants/toast";

type UpdateProductMutationInput = {
  productId: string;
  input: UpdateProductInput;
};

export function useProductMutations(apiBaseUrl: string) {
  const queryClient = useQueryClient();

  const invalidateProducts = useCallback(() => {
    void queryClient.invalidateQueries({
      queryKey: queryKeys.products.all(apiBaseUrl),
    });
  }, [apiBaseUrl, queryClient]);

  const createMutation = useMutation({
    mutationFn: (input: CreateProductInput) => createProduct(apiBaseUrl, input),
    onSuccess: () => {
      invalidateProducts();
      toast.success(PRODUCT_CREATED_TOAST_MESSAGE);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ productId, input }: UpdateProductMutationInput) =>
      updateProduct(apiBaseUrl, productId, input),
    onSuccess: (updatedProduct) => {
      void queryClient.invalidateQueries({
        queryKey: queryKeys.products.detail(apiBaseUrl, updatedProduct.id),
      });
      invalidateProducts();
      toast.success(PRODUCT_UPDATED_TOAST_MESSAGE);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteProduct(apiBaseUrl, productId),
    onSuccess: (_result, productId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.products.detail(apiBaseUrl, productId),
      });
      invalidateProducts();
      toast.success(PRODUCT_DELETED_TOAST_MESSAGE);
    },
  });

  return {
    createMutation,
    updateMutation,
    deleteMutation,
  };
}
