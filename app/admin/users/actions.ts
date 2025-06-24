"use server";

import { prisma } from "@/lib/prisma";
import { CreateUserSchema, UpdateUserSchema } from "@/schemas/user";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";

export async function getUsers() {
	return prisma.user.findMany({
		orderBy: { createdAt: "desc" },
	});
}

export async function getUserById(userId: string) {
	return prisma.user.findUnique({
		where: { id: userId },
    include: {
      accounts: true
    }
	});
}

export async function createUser(data: unknown) {
	const validationResult = CreateUserSchema.safeParse(data);
	if (!validationResult.success) {
		return { success: false, error: validationResult.error.flatten() };
	}

	const { name, email, role, password } = validationResult.data;

	try {
		const existingUser = await prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			return {
				success: false,
				error: { formErrors: ["Адрес почты занят"], fieldErrors: { email: ["Адрес почты занят"] } },
			};
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		await prisma.user.create({
			data: {
				name: name || null,
				email,
				role,
				hashedPassword,
			},
		});
		revalidatePath("/admin/users");
		return { success: true };
	} catch (e) {
		console.error(e);
		return { success: false, error: { formErrors: ["Ошибка создания пользователя"] } };
	}
}

export async function updateUser(userId: string, data: unknown) {
	const validationResult = UpdateUserSchema.safeParse(data);
	if (!validationResult.success) {
		return { success: false, error: validationResult.error.flatten() };
	}
	const { name, email, role, password } = validationResult.data;
	try {
		const updateData: { name?: string | null; email?: string; role?: UserRole; hashedPassword?: string } = {
			name: name || null,
			email,
			role,
		};
		if (password) {
			updateData.hashedPassword = await bcrypt.hash(password, 10);
		}
		if (email) {
			const currentUser = await prisma.user.findUnique({ where: { id: userId } });
			if (currentUser?.email !== email) {
				const existingUser = await prisma.user.findUnique({ where: { email } });
				if (existingUser) {
					return {
						success: false,
						error: {
							formErrors: ["Пользователь с адресом почты уже существует"],
							fieldErrors: { email: ["Пользователь с адресом почты уже существует"] },
						},
					};
				}
			}
		}
		await prisma.user.update({
			where: { id: userId },
			data: updateData,
		});
		revalidatePath("/admin/users");
		revalidatePath(`/admin/users/${userId}`);
		return { success: true };
	} catch (e) {
		console.error(e);
		return { success: false, error: { formErrors: ["Ошибка обновления пользователя"] } };
	}
}

export async function deleteUser(userId: string) {
	const session = await auth();
	const currentAdminId = session?.user?.id;

	if (userId === currentAdminId) {
		const currentUser = await prisma.user.findUnique({
			where: { id: currentAdminId },
			select: { role: true },
		});
		if (currentUser?.role === UserRole.ADMIN) {
			return { success: false, error: "Вы не можете удалить свой собственный аккаунт администратора." };
		}
	}

	try {
		await prisma.user.delete({
			where: { id: userId },
		});
		revalidatePath("/admin/users");
		return { success: true };
	} catch (e) {
		console.error(e);
		return { success: false, error: "Ошибка удаления пользователя" };
	}
  
}
