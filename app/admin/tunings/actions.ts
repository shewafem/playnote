/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TuningSchema, TuningFormInput, ServerActionError } from "@/schemas/tuning";

export async function createTuning(
	data: TuningFormInput
): Promise<{ success: boolean; error?: ServerActionError | string; tuningId?: number }> {
	const validatedFields = TuningSchema.safeParse(data);
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
	const { notes } = validatedFields.data;
	try {
		const existingTuning = await prisma.tuning.findUnique({
			where: {
				notes,
			},
		});
		if (existingTuning) {
			return {
				success: false,
				error: { formErrors: ["Такой тюнинг уже существует"], fieldErrors: { email: ["Ноты заняты"] } },
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
		return { success: false, error: error };
	}
}
export async function updateTuning(
	id: number,
	data: TuningFormInput
): Promise<{ success: boolean; error?: ServerActionError | string }> {
	const validatedFields = TuningSchema.safeParse(data);
	if (!validatedFields.success) {
		return {
			success: false,
			error: {
				fieldErrors: validatedFields.error.flatten().fieldErrors as Record<string, string[]>,
				formErrors: validatedFields.error.flatten().formErrors,
			},
		};
	}
	const { name, notes } = validatedFields.data;
	try {
		const existingTuning = await prisma.tuning.findUnique({
			where: {
				notes,
			},
		});
		if (existingTuning && existingTuning.id !== id) {
			return {
				success: false,
				error: { formErrors: ["Такой тюнинг уже существует"], fieldErrors: { email: ["Ноты заняты"] } },
			};
		}
		await prisma.tuning.update({
			where: { id },
			data: {
				name: name,
				notes: notes,
			},
		});

		revalidatePath("/admin/tunings");
		revalidatePath(`/admin/tunings/${id}`);
		return { success: true };
	} catch (error: any) {
		return { success: false, error: error };
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
		return { success: false, error: error };
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
