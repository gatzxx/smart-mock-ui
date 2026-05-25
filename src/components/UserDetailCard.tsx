import { ArrowLeft } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { UserDetail } from "@/types/userDetail";

type UserDetailCardProps = {
  user: UserDetail;
};

export const UserDetailCard = memo(function UserDetailCard({ user }: UserDetailCardProps) {
  return (
    <Card data-testid="user-detail-card">
      <CardHeader className="flex flex-row items-start gap-4">
        <img
          alt=""
          className="size-16 rounded-full border border-border object-cover"
          src={user.avatar}
        />
        <div className="min-w-0 flex-1 space-y-1">
          <CardTitle>{user.fullName}</CardTitle>
          <CardDescription>{user.email}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <dl className="grid gap-3 text-sm sm:grid-cols-[120px_1fr]">
          <dt className="text-muted-foreground">Телефон</dt>
          <dd>{user.phone}</dd>
          <dt className="text-muted-foreground">ID</dt>
          <dd className="truncate font-mono text-xs">{user.id}</dd>
        </dl>
        <div>
          <p className="mb-1 text-sm font-medium text-muted-foreground">О себе</p>
          <p className="text-sm leading-relaxed">{user.bio}</p>
        </div>
        <Button asChild className="mt-2" variant="outline">
          <Link to="/users">
            <ArrowLeft aria-hidden="true" className="size-4" />
            К списку
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
});
