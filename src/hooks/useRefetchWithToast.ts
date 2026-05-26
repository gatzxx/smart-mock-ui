import { useCallback } from "react";
import { toast } from "sonner";

import { REFETCH_SUCCESS_TOAST_MESSAGE } from "@/constants/theme";

type RefetchResult = {
  isSuccess: boolean;
};

type RefetchFn = () => Promise<RefetchResult>;

export function useRefetchWithToast(refetch: RefetchFn) {
  return useCallback(async () => {
    const result = await refetch();

    if (result.isSuccess) {
      toast.success(REFETCH_SUCCESS_TOAST_MESSAGE);
    }
  }, [refetch]);
}

export function useRefetchAllWithToast(refetchAll: () => Promise<RefetchResult[]>) {
  return useCallback(async () => {
    const results = await refetchAll();

    if (results.some((result) => result.isSuccess)) {
      toast.success(REFETCH_SUCCESS_TOAST_MESSAGE);
    }
  }, [refetchAll]);
}
