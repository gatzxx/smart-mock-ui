import { z } from "zod";

const productPriceSchema = z.union([z.number(), z.string()]).transform(String);

export const productSchema = z.object({
  id: z.string(),
  title: z.string(),
  price: productPriceSchema,
  inStock: z.boolean(),
  updatedAt: z.string().optional(),
});

export const productDetailSchema = productSchema.extend({
  description: z.string(),
  updatedAt: z.string(),
});

export type Product = z.infer<typeof productSchema>;
export type ProductDetail = z.infer<typeof productDetailSchema>;
