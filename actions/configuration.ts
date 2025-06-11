// @/actions/saveFretboardConfig.ts
"use server";

import { z } from "zod";
import { FretboardConfigurationSchema } from "@/schemas/fretboard-configarion";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { SavedFretboard } from "@prisma/client";

export async function saveFretboardConfigurationAction(values: z.infer<typeof FretboardConfigurationSchema>) {
	const session = await auth();

	if (!session?.user?.id) {
		return { success: false, error: "Необходимо авторизоваться." };
	}

	const validatedFields = FretboardConfigurationSchema.safeParse(values);
	if (!validatedFields.success) {
		return { success: false, error: "Неверные данные.", issues: validatedFields.error.flatten().fieldErrors };
	}
	const { name, configuration } = validatedFields.data;
	try {
		await prisma.savedFretboard.create({
			data: {
				name,
				link: configuration,
				userId: session.user.id,
			},
		});
		return { success: true, message: `Схема успешно сохранена!`};
	} catch (error) {
		console.error("Ошибка сохранения схемы:", error);
		return { success: false, error: "Не удалось сохранить схему. Попробуйте позже." };
	}
}

export async function getSavedFretboardConfigurationsAction(): Promise<{
	success: boolean;
	data?: SavedFretboard[];
	error?: string;
}> {
	const session = await auth();

	if (!session?.user?.id) {
		return { success: false, error: "Необходимо авторизоваться." };
	}

	try {
		const configurations = await prisma.savedFretboard.findMany({
			where: {
				userId: session.user.id,
			},
			orderBy: {
				createdAt: "desc",
			},
		});
		return { success: true, data: configurations };
	} catch (error) {
		console.error("Ошибка запроса схемы:", error);
		return { success: false, error: "Не удалось загрузить схему." };
	}
}

export async function deleteFretboardConfigurationAction(id: number): Promise<{
	success: boolean;
	message?: string;
	error?: string;
}> {
	const session = await auth();
	if (!session?.user?.id) {
		return { success: false, error: "Необходимо авторизоваться." };
	}

	try {
		const configToDelete = await prisma.savedFretboard.findUnique({
			where: { id },
		});

		if (!configToDelete) {
			return { success: false, error: "Схема не найдена." };
		}

		if (configToDelete.userId !== session.user.id) {
			return { success: false, error: "У вас нет прав для удаления этой схемы." };
		}

		await prisma.savedFretboard.delete({
			where: { id },
		});
		return { success: true, message: "Схема удалена." };
	} catch (error) {
		console.error("Ошибка удаления:", error);
		return { success: false, error: "Не удалось удалить схему." };
	}
}
