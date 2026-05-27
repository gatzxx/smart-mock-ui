import { memo, type HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Card = memo(function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-lg border border-border bg-card py-6 text-card-foreground shadow-sm",
        className,
      )}
      data-slot="card"
      {...props}
    />
  );
});

export const CardHeader = memo(function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col gap-1.5 px-6", className)}
      data-slot="card-header"
      {...props}
    />
  );
});

export const CardTitle = memo(function CardTitle({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("leading-none font-semibold", className)}
      data-slot="card-title"
      {...props}
    />
  );
});

export const CardDescription = memo(function CardDescription({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-muted-foreground", className)}
      data-slot="card-description"
      {...props}
    />
  );
});

export const CardContent = memo(function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-6", className)} data-slot="card-content" {...props} />;
});
