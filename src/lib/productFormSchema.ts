import { z } from "zod";

export const productFormSchema = z.object({
  title: z.string().trim().min(2, "Название должно быть не короче 2 символов"),
  price: z.number().positive("Цена должна быть больше 0"),
  inStock: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;

export function parseProductPrice(price: string | number): number {
  if (typeof price === "number") {
    return price;
  }

  const parsedPrice = Number.parseFloat(price.replace(/[^\d.-]/g, ""));

  return Number.isNaN(parsedPrice) ? 0 : parsedPrice;
}
