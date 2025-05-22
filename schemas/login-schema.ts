import { z } from "zod"

const loginSchema = z.object({
  email: z.string().email({ message: "Неверный формат почты" }),
  password: z.string().min(1, { message: "Пароль обязателен" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export { loginSchema, type LoginFormValues };