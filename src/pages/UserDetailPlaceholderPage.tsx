import { memo } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const UserDetailPlaceholderPage = memo(function UserDetailPlaceholderPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <Card data-testid="user-detail-placeholder">
      <CardHeader>
        <CardTitle>User detail</CardTitle>
        <CardDescription>
          Placeholder for Wave 4. Selected id:{" "}
          <code className="rounded bg-muted px-1.5 py-0.5 text-xs">{id}</code>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline">
          <Link to="/users">Back to users</Link>
        </Button>
      </CardContent>
    </Card>
  );
});
