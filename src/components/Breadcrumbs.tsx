import { ChevronRight } from "lucide-react";
import { Fragment, memo } from "react";
import { Link } from "react-router-dom";

import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  className?: string;
  testId?: string;
};

export const Breadcrumbs = memo(function Breadcrumbs({
  items,
  className,
  testId,
}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("mb-4", className)} data-testid={testId}>
      <ol className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <Fragment key={`${item.label}-${index}`}>
              {index > 0 ? (
                <li aria-hidden="true">
                  <ChevronRight className="size-4" />
                </li>
              ) : null}
              <li>
                {item.href && !isLast ? (
                  <Link
                    className="font-medium text-primary underline-offset-4 hover:underline"
                    to={item.href}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span
                    aria-current={isLast ? "page" : undefined}
                    className={cn(isLast && "font-medium text-foreground")}
                  >
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
});
