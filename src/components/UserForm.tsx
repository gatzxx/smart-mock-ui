import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { userFormSchema, type UserFormValues } from "@/lib/userFormSchema";

type UserFormProps = {
  defaultValues?: UserFormValues;
  isSubmitting: boolean;
  submitLabel: string;
  onCancel: () => void;
  onSubmit: (values: UserFormValues) => void;
};

const EMPTY_FORM_VALUES: UserFormValues = {
  fullName: "",
  email: "",
  role: "",
};

export const UserForm = memo(function UserForm({
  defaultValues,
  isSubmitting,
  submitLabel,
  onCancel,
  onSubmit,
}: UserFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UserFormValues>({
    defaultValues: defaultValues ?? EMPTY_FORM_VALUES,
    resolver: zodResolver(userFormSchema),
  });

  const isSubmitDisabled = isSubmitting || !isDirty;

  const handleFormSubmit = useCallback(
    (values: UserFormValues) => {
      onSubmit(values);
    },
    [onSubmit],
  );

  return (
    <form
      className="space-y-4"
      data-testid="user-form"
      noValidate
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="user-fullName">
          Имя
        </label>
        <Input
          aria-describedby={errors.fullName ? "user-fullName-error" : undefined}
          aria-invalid={Boolean(errors.fullName)}
          id="user-fullName"
          {...register("fullName")}
        />
        {errors.fullName ? (
          <p className="text-sm text-destructive" id="user-fullName-error" role="alert">
            {errors.fullName.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="user-email">
          Email
        </label>
        <Input
          aria-describedby={errors.email ? "user-email-error" : undefined}
          aria-invalid={Boolean(errors.email)}
          id="user-email"
          type="email"
          {...register("email")}
        />
        {errors.email ? (
          <p className="text-sm text-destructive" id="user-email-error" role="alert">
            {errors.email.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="user-role">
          Роль
        </label>
        <Input
          aria-describedby={errors.role ? "user-role-error" : undefined}
          aria-invalid={Boolean(errors.role)}
          id="user-role"
          {...register("role")}
        />
        {errors.role ? (
          <p className="text-sm text-destructive" id="user-role-error" role="alert">
            {errors.role.message}
          </p>
        ) : null}
      </div>

      <div className="flex flex-wrap gap-2">
        <Button disabled={isSubmitDisabled} type="submit">
          {isSubmitting ? "Сохранение..." : submitLabel}
        </Button>
        <Button
          disabled={isSubmitting}
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          Отмена
        </Button>
      </div>
    </form>
  );
});
