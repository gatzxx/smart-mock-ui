import { z } from "zod";

export const userSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string(),
  role: z.string(),
  createdAt: z.string().optional(),
});

export const userDetailSchema = userSchema.extend({
  role: z.string().optional(),
  phone: z.string(),
  avatar: z.string(),
  bio: z.string(),
});

export type User = z.infer<typeof userSchema>;
export type UserDetail = z.infer<typeof userDetailSchema>;
