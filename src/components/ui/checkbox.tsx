import { memo, type InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Checkbox = memo(function Checkbox({
  className,
  type = "checkbox",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "pressable size-4 shrink-0 rounded-[4px] border border-input bg-background accent-primary shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95",
        className,
      )}
      data-slot="checkbox"
      type={type}
      {...props}
    />
  );
});
