import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { API_ACTIVITY_MAX_ENTRIES } from "@/constants/apiActivity";
import { setApiActivityRecorder } from "@/lib/apiActivityRecorder";
import type { ApiActivityEntry, ApiActivityRecord } from "@/types/apiActivity";

type ApiActivityContextValue = {
  clearActivities: () => void;
  entries: ApiActivityEntry[];
};

const ApiActivityContext = createContext<ApiActivityContextValue | null>(null);

type ApiActivityProviderProps = {
  children: ReactNode;
};

export const ApiActivityProvider = memo(function ApiActivityProvider({
  children,
}: ApiActivityProviderProps) {
  const [entries, setEntries] = useState<ApiActivityEntry[]>([]);

  const recordActivity = useCallback((entry: ApiActivityRecord) => {
    setEntries((currentEntries) =>
      [{ ...entry, id: crypto.randomUUID() }, ...currentEntries].slice(
        0,
        API_ACTIVITY_MAX_ENTRIES,
      ),
    );
  }, []);

  const clearActivities = useCallback(() => {
    setEntries([]);
  }, []);

  useEffect(() => {
    setApiActivityRecorder(recordActivity);

    return () => {
      setApiActivityRecorder(null);
    };
  }, [recordActivity]);

  const value = useMemo(
    () => ({
      clearActivities,
      entries,
    }),
    [clearActivities, entries],
  );

  return (
    <ApiActivityContext.Provider value={value}>{children}</ApiActivityContext.Provider>
  );
});

export function useApiActivity(): ApiActivityContextValue {
  const context = useContext(ApiActivityContext);

  if (!context) {
    throw new Error("useApiActivity must be used within ApiActivityProvider");
  }

  return context;
}
