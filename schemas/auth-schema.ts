import * as z from "zod";

export const LoginSchema = z.object({
	email: z.string().email({
		message: "Пожалуйста, введите корректную электронную почту",
	}),
	password: z.string().min(12, {
		message: "Пароль должен быть не менее 12 символов",
	}),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Пожалуйста, введите корректную электронную почту",
  }),
  password: z.string().min(12, {
    message: "Пароль должен быть не менее 12 символов",
  }),
  confirmPassword: z.string().min(1, {
    message: "Повторите пароль",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

export type LoginFormValues = z.infer<typeof LoginSchema>;
export type RegistrationFormValues = z.infer<typeof RegisterSchema>;