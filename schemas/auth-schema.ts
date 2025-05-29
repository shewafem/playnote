import * as z from "zod";

export const LoginSchema = z.object({
	email: z.string().email({
		message: "Пожалуйста, введите корректную электронную почту",
	}),
	password: z.string().min(12, {
		message: "Пароль должен быть не менее 12 символов",
	}),
});

export const RegisterSchema = z
	.object({
		email: z.string().email({
			message: "Пожалуйста, введите корректную электронную почту",
		}),
		password: z.string().min(12, {
			message: "Пароль должен быть не менее 12 символов",
		}),
		confirmPassword: z.string().min(1, {
			message: "Повторите пароль",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Пароли не совпадают",
		path: ["confirmPassword"],
	});

// New Schemas for Password Reset
export const ForgotPasswordSchema = z.object({
	email: z.string().email({
		message: "Пожалуйста, введите действительный адрес электронной почты.",
	}),
});
export type ForgotPasswordFormValues = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z
	.object({
		password: z.string().min(12, {
			message: "Пароль должен содержать не менее 12 символов.",
		}),
		confirmPassword: z.string().min(12, {
			message: "Подтверждение пароля должно содержать не менее 12 символов.",
		}),
		token: z.string().min(1, {
			// Token will be hidden input or passed directly
			message: "Токен обязателен.",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Пароли не совпадают.",
		path: ["confirmPassword"], // path of error
	});

export const ProfileInfoSchema = z.object({
	name: z.string()
		.min(2, { message: "Имя пользователя должно содержать не менее 2 символов." })
		.max(50, { message: "Имя пользователя не должно превышать 50 символов." }),
	email: z.string().email({
		message: "Пожалуйста, введите корректную электронную почту.",
	}),
});

// Schema for Password Update
export const UpdatePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, { message: "Текущий пароль обязателен." }),
		newPassword: z
			.string()
			.min(12, { message: "Новый пароль должен быть не менее 12 символов." }),
			//.regex(/[A-Z]/, { message: "Пароль должен содержать хотя бы одну заглавную букву." })
			//.regex(/[a-z]/, { message: "Пароль должен содержать хотя бы одну строчную букву." })
			//.regex(/[0-9]/, { message: "Пароль должен содержать хотя бы одну цифру." })
			//.regex(/[^A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, { // Adjusted regex for common special chars
			//	message: "Пароль должен содержать хотя бы один специальный символ.",
			//}),
		confirmNewPassword: z.string().min(1, { message: "Подтверждение нового пароля обязательно." }),
	})
	.refine((data) => data.newPassword === data.confirmNewPassword, {
		message: "Новые пароли не совпадают.",
		path: ["confirmNewPassword"], // Error will be shown on confirmNewPassword field
	});


export type ResetPasswordFormValues = z.infer<typeof ResetPasswordSchema>;
export type LoginFormValues = z.infer<typeof LoginSchema>;
export type RegistrationFormValues = z.infer<typeof RegisterSchema>;
export type ProfileInfoFormValues = z.infer<typeof ProfileInfoSchema>;
export type UpdatePasswordFormValues = z.infer<typeof UpdatePasswordSchema>;
