/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TuningSchema, TuningFormInput, ServerActionError } from "@/schemas/tuning";
import { Prisma } from "@prisma/client";

function handlePrismaError(error: any, defaultMessage: string): { success: false; error: ServerActionError | string } {
	console.error("Prisma Error:", error);
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		if (error.code === "P2002" && error.meta?.target) {
			const target = error.meta.target as string[];
			if (target.includes("name")) {
				return { success: false, error: { fieldErrors: { name: ["Название строя уже существует."] } } };
			}
			if (target.includes("notes")) {
				return {
					success: false,
					error: { fieldErrors: { notes: ["Такой набор нот уже существует в другом строе."] } },
				};
			}
		}
	}
	return { success: false, error: defaultMessage + (error.message ? `: ${error.message}` : "") };
}

export async function createTuning(
	data: TuningFormInput
): Promise<{ success: boolean; error?: ServerActionError | string; tuningId?: number }> {
	try {
		const validatedFields = TuningSchema.safeParse(data);

		if (!validatedFields.success) {
			console.error("Validation errors on create:", validatedFields.error.flatten());
			return {
				success: false,
				error: {
					fieldErrors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
					formErrors: validatedFields.error.flatten().formErrors,
				},
			};
		}
		const newTuning = await prisma.tuning.create({
			data: {
				name: validatedFields.data.name,
				notes: validatedFields.data.notes,
			},
		});
		revalidatePath("/admin/tunings");
		return { success: true, tuningId: newTuning.id };
	} catch (error: any) {
		return handlePrismaError(error, "Не удалось создать тюнинг");
	}
}

export async function updateTuning(
	id: number,
	data: TuningFormInput
): Promise<{ success: boolean; error?: ServerActionError | string }> {
	try {
		const validatedFields = TuningSchema.safeParse(data);

		if (!validatedFields.success) {
			console.error("Ошибка валидации при обновлении:", validatedFields.error.flatten());
			return {
				success: false,
				error: {
					fieldErrors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
					formErrors: validatedFields.error.flatten().formErrors,
				},
			};
		}

		await prisma.tuning.update({
			where: { id },
			data: {
				name: validatedFields.data.name,
				notes: validatedFields.data.notes,
			},
		});

		revalidatePath("/admin/tunings");
		revalidatePath(`/admin/tunings/${id}`);
		return { success: true };
	} catch (error: any) {
		return handlePrismaError(error, "Не удалось обновить тюнинг");
	}
}
export async function deleteTuning(id: number): Promise<{ success: boolean; error?: string }> {
	try {
		await prisma.tuning.delete({
			where: { id },
		});

		revalidatePath("/admin/tunings");
		revalidatePath(`/admin/tunings/${id}`);
		return { success: true };
	} catch (error: any) {
		console.error("ошибка удаления строя:", error);
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2025") {
				return { success: false, error: "Тюнинг не найден для удаления." };
			}
		}
		return { success: false, error: "Не удалось удалить тюнинг." + (error.message ? `: ${error.message}` : "") };
	}
}

export async function getTuningById(id: number) {
	try {
		if (isNaN(id) || id <= 0) {
			return null;
		}
		const tuning = await prisma.tuning.findUnique({
			where: { id },
		});
		return tuning;
	} catch (error) {
		console.error(`Ошибка получения строя${id}:`, error);
		return null;
	}
}

export async function getAllTunings() {
	try {
		const tunings = await prisma.tuning.findMany({
			orderBy: {
				name: "asc",
			},
		});
		return tunings;
	} catch (error) {
		console.error("Ошибка получения строев:", error);
		return [];
	}
}
