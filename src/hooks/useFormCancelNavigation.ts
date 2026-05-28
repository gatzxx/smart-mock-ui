import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export function useFormCancelNavigation(fallbackHref: string) {
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    if (location.key !== "default") {
      navigate(-1);
      return;
    }

    navigate(fallbackHref);
  }, [fallbackHref, location.key, navigate]);
}
