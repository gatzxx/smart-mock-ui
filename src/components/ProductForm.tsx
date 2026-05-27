import { zodResolver } from "@hookform/resolvers/zod";
import { memo, useCallback } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { productFormSchema, type ProductFormValues } from "@/lib/productFormSchema";

type ProductFormProps = {
  defaultValues?: ProductFormValues;
  isSubmitting: boolean;
  submitLabel: string;
  onSubmit: (values: ProductFormValues) => void;
};

const EMPTY_FORM_VALUES: ProductFormValues = {
  title: "",
  price: 0,
  inStock: true,
};

export const ProductForm = memo(function ProductForm({
  defaultValues,
  isSubmitting,
  submitLabel,
  onSubmit,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    defaultValues: defaultValues ?? EMPTY_FORM_VALUES,
    resolver: zodResolver(productFormSchema),
  });

  const handleFormSubmit = useCallback(
    (values: ProductFormValues) => {
      onSubmit(values);
    },
    [onSubmit],
  );

  return (
    <form
      className="space-y-4"
      data-testid="product-form"
      noValidate
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="product-title">
          Название
        </label>
        <Input
          aria-describedby={errors.title ? "product-title-error" : undefined}
          aria-invalid={Boolean(errors.title)}
          id="product-title"
          {...register("title")}
        />
        {errors.title ? (
          <p className="text-sm text-destructive" id="product-title-error" role="alert">
            {errors.title.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="product-price">
          Цена
        </label>
        <Input
          aria-describedby={errors.price ? "product-price-error" : undefined}
          aria-invalid={Boolean(errors.price)}
          id="product-price"
          min="0"
          step="0.01"
          type="number"
          {...register("price", { valueAsNumber: true })}
        />
        {errors.price ? (
          <p className="text-sm text-destructive" id="product-price-error" role="alert">
            {errors.price.message}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox id="product-inStock" {...register("inStock")} />
        <label className="text-sm font-medium" htmlFor="product-inStock">
          В наличии
        </label>
      </div>

      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Сохранение..." : submitLabel}
      </Button>
    </form>
  );
});
