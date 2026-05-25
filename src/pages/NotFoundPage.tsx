import { FileQuestion } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const NotFoundPage = memo(function NotFoundPage() {
  return (
    <Card className="mx-auto max-w-lg text-center" data-testid="not-found-page">
      <CardHeader>
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
          <FileQuestion aria-hidden="true" className="size-6 text-muted-foreground" />
        </div>
        <CardTitle>404 - страница не найдена</CardTitle>
        <CardDescription>
          Такого маршрута нет в demo admin-panel. Проверьте URL или вернитесь на обзор.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link to="/">На главную</Link>
        </Button>
      </CardContent>
    </Card>
  );
});
