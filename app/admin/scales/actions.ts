/* eslint-disable @typescript-eslint/no-explicit-any */
// app/admin/scales/actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ScaleDbSchema, ScaleFormData, ServerActionError } from "@/schemas/scale";
import { Prisma } from "@prisma/client";

export async function createScale(
	data: ScaleFormData
): Promise<{ success: boolean; error?: ServerActionError | string; scaleId?: number }> {
	const validatedFields = ScaleDbSchema.safeParse(data);
	if (!validatedFields.success) {
		console.error("Ошибка валидации:", validatedFields.error.flatten());
		return {
			success: false,
			error: {
				fieldErrors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
				formErrors: validatedFields.error.flatten().formErrors,
			},
		};
	}

	const { name, formula } = validatedFields.data;

	try {
		const existingScale = await prisma.scale.findFirst({
			where: {
				OR: [{ name }, { formula: { equals: formula } }],
			},
		});

		if (existingScale) {
			const errors: { formErrors?: string[]; fieldErrors?: Record<string, string[]> } = { fieldErrors: {} };
			if (existingScale.name === name) {
				errors.fieldErrors!.name = ["Гамма с таким названием уже существует."];
			}
			if (JSON.stringify(existingScale.formula) === JSON.stringify(formula)) {
				errors.fieldErrors!.formula = ["Гамма с такой формулой уже существует."];
			}
			return { success: false, error: errors };
		}

		const newScale = await prisma.scale.create({
			data: { name, formula },
		});

		revalidatePath("/admin/scales");
		return { success: true, scaleId: newScale.id };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				return { success: false, error: { formErrors: ["Эта гамма уже существует."] } };
			}
		}
		console.error("Ошибка создания гаммы:", error);
		return { success: false, error: "Неизвестная серверная ошибка." };
	}
}

export async function updateScale(
	id: number,
	data: ScaleFormData
): Promise<{ success: boolean; error?: ServerActionError | string }> {
	const validatedFields = ScaleDbSchema.safeParse(data);
	if (!validatedFields.success) {
		return {
			success: false,
			error: {
				fieldErrors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
				formErrors: validatedFields.error.flatten().formErrors,
			},
		};
	}

	const { name, formula } = validatedFields.data;

	try {
		const existingScale = await prisma.scale.findFirst({
			where: {
				NOT: { id },
				OR: [{ name }, { formula: { equals: formula } }],
			},
		});

		if (existingScale) {
			const errors: { formErrors?: string[]; fieldErrors?: Record<string, string[]> } = { fieldErrors: {} };
			if (existingScale.name === name) {
				errors.fieldErrors!.name = ["Гамма с таким названием уже существует."];
			}
			if (JSON.stringify(existingScale.formula) === JSON.stringify(formula)) {
				errors.fieldErrors!.formula = ["Гамма с такой формулой уже существует."];
			}
			return { success: false, error: errors };
		}

		await prisma.scale.update({
			where: { id },
			data: { name, formula },
		});

		revalidatePath("/admin/scales");
		revalidatePath(`/admin/scales/${id}`);
		return { success: true };
	} catch (error) {
		console.error(`Ошибка обновления гаммы ${id}:`, error);
		return { success: false, error: "Неизвестная серверная ошибка." };
	}
}

export async function deleteScale(id: number): Promise<{ success: boolean; error?: string }> {
	try {
		await prisma.scale.delete({
			where: { id },
		});

		revalidatePath("/admin/scales");
		return { success: true };
	} catch (error: any) {
		console.error(`Ошибка удаления гаммы ${id}:`, error);
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
			return { success: false, error: "Невозможно удалить гамму, так как она используется пользователями." };
		}
		return { success: false, error: "Произошла ошибка при удалении." };
	}
}

export async function getScaleById(id: number) {
	try {
		const scale = await prisma.scale.findUnique({
			where: { id },
		});
		return scale;
	} catch (error) {
		console.error(`Ошибка получения гаммы ${id}:`, error);
		return null;
	}
}

export async function getAllScales() {
	try {
		const scales = await prisma.scale.findMany({
			orderBy: {
				name: "asc",
			},
		});
		return scales;
	} catch (error) {
		console.error("Ошибка получения гамм:", error);
		return [];
	}
}
