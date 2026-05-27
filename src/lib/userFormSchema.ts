import { z } from "zod";

export const userFormSchema = z.object({
  fullName: z.string().trim().min(2, "Имя должно быть не короче 2 символов"),
  email: z.string().trim().email("Некорректный email"),
  role: z.string().trim().min(2, "Роль обязательна"),
});

export type UserFormValues = z.infer<typeof userFormSchema>;
