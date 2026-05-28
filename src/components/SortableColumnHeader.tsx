import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { memo, useCallback, type ReactNode } from "react";

export type SortDirection = "asc" | "desc" | false;

type SortableColumnHeaderProps = {
  label: ReactNode;
  onSort: () => void;
  sortDirection: SortDirection;
  sortLabel: string;
};

export const SortableColumnHeader = memo(function SortableColumnHeader({
  label,
  onSort,
  sortDirection,
  sortLabel,
}: SortableColumnHeaderProps) {
  const handleClick = useCallback(() => {
    onSort();
  }, [onSort]);

  return (
    <button
      aria-label={`Сортировать: ${sortLabel}`}
      className="pressable inline-flex items-center gap-1 rounded-sm px-1 font-medium text-muted-foreground hover:text-foreground active:text-foreground active:opacity-80"
      type="button"
      onClick={handleClick}
    >
      {label}
      {sortDirection === "asc" ? (
        <ArrowUp aria-hidden="true" className="size-3.5" />
      ) : sortDirection === "desc" ? (
        <ArrowDown aria-hidden="true" className="size-3.5" />
      ) : (
        <ArrowUpDown aria-hidden="true" className="size-3.5 opacity-60" />
      )}
    </button>
  );
});
