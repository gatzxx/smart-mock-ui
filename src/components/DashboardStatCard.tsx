import type { LucideIcon } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type DashboardStatCardProps = {
  description: string;
  href?: string;
  icon: LucideIcon;
  testId: string;
  title: string;
  value: string;
};

export const DashboardStatCard = memo(function DashboardStatCard({
  description,
  href,
  icon: Icon,
  testId,
  title,
  value,
}: DashboardStatCardProps) {
  const card = (
    <Card className={cn(href && "hover:bg-accent/40")} data-testid={testId}>
      <CardHeader className="flex flex-row items-start justify-between gap-3">
        <div className="space-y-1">
          <CardDescription>{title}</CardDescription>
          <CardTitle className="text-3xl tabular-nums">{value}</CardTitle>
        </div>
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-muted">
          <Icon aria-hidden="true" className="size-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );

  if (!href) {
    return card;
  }

  return (
    <Link
      className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      to={href}
    >
      {card}
    </Link>
  );
});
