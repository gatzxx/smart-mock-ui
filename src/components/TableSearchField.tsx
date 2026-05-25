import { Search } from "lucide-react";
import { memo, useCallback, type ChangeEvent } from "react";

import { Input } from "@/components/ui/input";

type TableSearchFieldProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  testId: string;
};

export const TableSearchField = memo(function TableSearchField({
  value,
  onChange,
  placeholder,
  testId,
}: TableSearchFieldProps) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value);
    },
    [onChange],
  );

  return (
    <div className="relative mb-4 max-w-sm">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        aria-label={placeholder}
        className="pl-9"
        data-testid={testId}
        placeholder={placeholder}
        type="search"
        value={value}
        onChange={handleChange}
      />
    </div>
  );
});
