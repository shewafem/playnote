// lib/schemas/user.ts
import { z } from "zod";
import { UserRole } from "@prisma/client";

const BaseUserSchema = z.object({
	name: z.string().min(1, "Введите имя").optional().or(z.literal("")),
	email: z.string().email("Неправильный адрес почты"),
	role: z.nativeEnum(UserRole),
	password: z.string().min(12, "Пароль должен быть больше 12 символов").optional().or(z.literal("")),
	confirmPassword: z.string().optional().or(z.literal("")),
});

export const UserSchema = BaseUserSchema.refine(
	(data) => {
		if (data.password && data.password !== data.confirmPassword) {
			return false;
		}
		return true;
	},
	{
		message: "Пароли не совпадают",
		path: ["confirmPassword"],
	}
);

export const CreateUserSchema = BaseUserSchema.extend({
	password: z.string().min(12, "Пароль должен быть больше 12 символов"),
}).refine(
	(data) => {
		if (data.password && data.password !== data.confirmPassword) {
			return false;
		}
		return true;
	},
	{
		message: "Пароли не совпадают",
		path: ["confirmPassword"],
	}
);

export const UpdateUserSchema = UserSchema;

export type UserFormData = z.infer<typeof UserSchema>;
export type CreateUserFormData = z.infer<typeof CreateUserSchema>;
export type UpdateUserFormData = z.infer<typeof UpdateUserSchema>;
