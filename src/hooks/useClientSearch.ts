import { useCallback, useMemo, useState } from "react";

export function useClientSearch<T>(items: T[], getSearchText: (item: T) => string) {
  const [query, setQuery] = useState("");

  const normalizedQuery = useMemo(() => query.trim().toLowerCase(), [query]);

  const filteredItems = useMemo(() => {
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) =>
      getSearchText(item).toLowerCase().includes(normalizedQuery),
    );
  }, [getSearchText, items, normalizedQuery]);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  return {
    query,
    setQuery: handleQueryChange,
    filteredItems,
    hasActiveQuery: normalizedQuery.length > 0,
  };
}
