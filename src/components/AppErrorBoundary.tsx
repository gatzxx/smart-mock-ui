import { AlertCircle } from "lucide-react";
import { Component, memo, type ErrorInfo, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type AppErrorBoundaryProps = {
  children: ReactNode;
};

type AppErrorBoundaryState = {
  hasError: boolean;
};

function handleReloadClick(): void {
  window.location.reload();
}

const ErrorFallback = memo(function ErrorFallback() {
  return (
    <div
      className="flex min-h-screen items-center justify-center bg-background p-4"
      data-testid="app-error-boundary"
      role="alert"
    >
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-start gap-3">
          <AlertCircle
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-destructive"
          />
          <div className="space-y-1">
            <CardTitle>Что-то пошло не так</CardTitle>
            <CardDescription>
              Произошла ошибка при отображении страницы. Попробуйте перезагрузить
              приложение.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Button type="button" onClick={handleReloadClick}>
            Перезагрузить страницу
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});

export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  public state: AppErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("AppErrorBoundary caught an error:", error, errorInfo);
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
