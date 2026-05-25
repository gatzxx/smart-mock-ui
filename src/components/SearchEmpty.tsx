import { memo } from "react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SearchEmptyProps = {
  testId: string;
  title: string;
  description: string;
};

export const SearchEmpty = memo(function SearchEmpty({
  testId,
  title,
  description,
}: SearchEmptyProps) {
  return (
    <Card data-testid={testId}>
      <CardHeader className="text-center">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
});
