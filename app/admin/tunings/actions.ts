// app/admin/tunings/actions.ts
"use server";

import { prisma } from "@/lib/prisma"; // Ваш Prisma client
import { TuningSchema, TuningFormInput } from "@/schemas/tuning"; // Схемы Zod
import { Prisma, Tuning } from "@prisma/client"; // Типы Prisma
import { revalidatePath } from "next/cache";
import { ServerActionError } from "@/schemas/tuning"; // Импортируем ServerActionError

export async function getTunings(): Promise<Tuning[]> {
	try {
		return await prisma.tuning.findMany({
			orderBy: { name: "asc" },
		});
	} catch (error) {
		console.error("Failed to fetch tunings:", error);
		return []; // Возвращаем пустой массив в случае ошибки
	}
}

export async function getTuningById(tuningId: number): Promise<Tuning | null> {
	try {
		return await prisma.tuning.findUnique({
			where: { id: tuningId },
		});
	} catch (error) {
		console.error(`Failed to fetch tuning with id ${tuningId}:`, error);
		return null;
	}
}

// Типизируем возвращаемое значение для единообразия с другими формами
export async function createTuning(
	formData: TuningFormInput
): Promise<{ success: boolean; error?: ServerActionError | string; data?: Tuning }> {
	// Валидация с помощью TuningSchema, которая трансформирует notes из строки в string[]
	const validationResult = TuningSchema.safeParse(formData);

	if (!validationResult.success) {
		return {
			success: false,
			error: validationResult.error.flatten(), // Ошибки Zod
		};
	}

	const { name, notes } = validationResult.data; // name: string, notes: string[]

	try {
		// Проверка на уникальность имени (регистронезависимая, если нужно)
		const existingTuningByName = await prisma.tuning.findFirst({
			where: { name: { equals: name, mode: "insensitive" } }, // mode: 'insensitive' для регистронезависимого поиска
		});
		if (existingTuningByName) {
			return {
				success: false,
				error: { fieldErrors: { name: ["Тюнинг с таким названием уже существует."] } },
			};
		}

		// Проверка на уникальность набора нот (если это бизнес-требование)
		// Это сложнее, так как порядок важен, и Prisma не может напрямую сравнивать массивы в where.
		// Можно получить все тюнинги и сравнить программно, но это может быть неэффективно.
		// Для простоты, пока пропустим сложную проверку уникальности notes[], но уникальный индекс в Prisma schema это делает.
		// Если уникальный индекс @unique на notes[] в схеме Prisma, база данных сама выдаст ошибку.

		const newTuning = await prisma.tuning.create({
			data: {
				name,
				notes, // notes уже является string[] после валидации TuningSchema
			},
		});
		revalidatePath("/admin/tunings"); // Обновляем кеш для страницы списка тюнингов
		return { success: true, data: newTuning };
	} catch (error) {
		console.error("Failed to create tuning:", error);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// P2002 - Unique constraint failed
			if (error.code === "P2002") {
				const target = error.meta?.target as string[] | undefined;
				if (target && target.includes("name")) {
					return { success: false, error: { fieldErrors: { name: ["Тюнинг с таким названием уже существует."] } } };
				}
				if (target && target.includes("notes")) {
					return { success: false, error: { fieldErrors: { notes: ["Тюнинг с таким набором нот уже существует."] } } };
				}
				return { success: false, error: "Ошибка уникальности: такой тюнинг уже существует." };
			}
		}
		return { success: false, error: "Не удалось создать тюнинг. Попробуйте снова." };
	}
}

export async function updateTuning(
	tuningId: number,
	formData: TuningFormInput
): Promise<{ success: boolean; error?: ServerActionError | string; data?: Tuning }> {
	const validationResult = TuningSchema.safeParse(formData);

	if (!validationResult.success) {
		return {
			success: false,
			error: validationResult.error.flatten(),
		};
	}

	const { name, notes } = validationResult.data; // name: string, notes: string[]

	try {
		const existingTuning = await prisma.tuning.findUnique({
			where: { id: tuningId },
		});

		if (!existingTuning) {
			return { success: false, error: "Тюнинг для обновления не найден." };
		}

		// Проверка на уникальность имени (если оно изменилось и новое имя уже занято другим тюнингом)
		if (name.toLowerCase() !== existingTuning.name.toLowerCase()) {
			const tuningWithNewName = await prisma.tuning.findFirst({
				where: {
					name: { equals: name, mode: "insensitive" },
					NOT: { id: tuningId }, // Исключаем текущий тюнинг
				},
			});
			if (tuningWithNewName) {
				return {
					success: false,
					error: { fieldErrors: { name: ["Тюнинг с таким названием уже существует."] } },
				};
			}
		}

		// Аналогично для notes, если есть уникальный индекс и они изменились.

		const updatedTuning = await prisma.tuning.update({
			where: { id: tuningId },
			data: {
				name,
				notes,
			},
		});
		revalidatePath("/admin/tunings");
		revalidatePath(`/admin/tunings/${tuningId}/edit`); // Обновляем кеш для страницы редактирования
		return { success: true, data: updatedTuning };
	} catch (error) {
		console.error(`Failed to update tuning ${tuningId}:`, error);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				const target = error.meta?.target as string[] | undefined;
				if (target && target.includes("name")) {
					return { success: false, error: { fieldErrors: { name: ["Тюнинг с таким названием уже существует."] } } };
				}
				if (target && target.includes("notes")) {
					return { success: false, error: { fieldErrors: { notes: ["Тюнинг с таким набором нот уже существует."] } } };
				}
				return { success: false, error: "Ошибка уникальности: такой тюнинг уже существует." };
			}
		}
		return { success: false, error: "Не удалось обновить тюнинг. Попробуйте снова." };
	}
}

export async function deleteTuning(tuningId: number): Promise<{ success: boolean; error?: string }> {
	try {
		await prisma.tuning.delete({
			where: { id: tuningId },
		});
		revalidatePath("/admin/tunings");
		return { success: true };
	} catch (error) {
		console.error(`Failed to delete tuning ${tuningId}:`, error);
		// Здесь можно добавить более специфическую обработку ошибок, если тюнинг связан с другими сущностями
		// и не может быть удален из-за ограничений внешнего ключа (хотя в вашей схеме этого не видно для Tuning).
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			// P2025 - Record to delete does not exist.
			if (error.code === "P2025") {
				return { success: false, error: "Тюнинг для удаления не найден." };
			}
		}
		return { success: false, error: "Не удалось удалить тюнинг." };
	}
}
