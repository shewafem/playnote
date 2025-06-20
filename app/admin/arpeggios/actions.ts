/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ArpeggioDbSchema, ArpeggioFormData, ServerActionError } from "@/schemas/arpeggio";
import { Prisma } from "@prisma/client";

export async function createArpeggio(
	data: ArpeggioFormData
): Promise<{ success: boolean; error?: ServerActionError | string; arpeggioId?: number }> {
	const validatedFields = ArpeggioDbSchema.safeParse(data);
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
		const existingArpeggio = await prisma.arpeggio.findFirst({
			where: {
				OR: [{ name }, { formula: { equals: formula } }],
			},
		});

		if (existingArpeggio) {
			const errors: { formErrors?: string[]; fieldErrors?: Record<string, string[]> } = { fieldErrors: {} };
			if (existingArpeggio.name === name) {
				errors.fieldErrors!.name = ["Арпеджио с таким названием уже существует."];
			}
			if (JSON.stringify(existingArpeggio.formula) === JSON.stringify(formula)) {
				errors.fieldErrors!.formula = ["Арпеджио с такой формулой уже существует."];
			}
			return { success: false, error: errors };
		}

		const newArpeggio = await prisma.arpeggio.create({
			data: { name, formula },
		});

		revalidatePath("/admin/arpeggios");
		return { success: true, arpeggioId: newArpeggio.id };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === "P2002") {
				return { success: false, error: { formErrors: ["Это арпеджио уже существует."] } };
			}
		}
		console.error("Ошибка создания арпеджио:", error);
		return { success: false, error: "Неизвестная серверная ошибка." };
	}
}

export async function updateArpeggio(
	id: number,
	data: ArpeggioFormData
): Promise<{ success: boolean; error?: ServerActionError | string }> {
	const validatedFields = ArpeggioDbSchema.safeParse(data);
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
		const existingArpeggio = await prisma.arpeggio.findFirst({
			where: {
				NOT: { id },
				OR: [{ name }, { formula: { equals: formula } }],
			},
		});

		if (existingArpeggio) {
			const errors: { formErrors?: string[]; fieldErrors?: Record<string, string[]> } = { fieldErrors: {} };
			if (existingArpeggio.name === name) {
				errors.fieldErrors!.name = ["Арпеджио с таким названием уже существует."];
			}
			if (JSON.stringify(existingArpeggio.formula) === JSON.stringify(formula)) {
				errors.fieldErrors!.formula = ["Арпеджио с такой формулой уже существует."];
			}
			return { success: false, error: errors };
		}

		await prisma.arpeggio.update({
			where: { id },
			data: { name, formula },
		});

		revalidatePath("/admin/arpeggios");
		revalidatePath(`/admin/arpeggios/${id}`);
		return { success: true };
	} catch (error) {
		console.error(`Ошибка обновления арпеджио ${id}:`, error);
		return { success: false, error: "Неизвестная серверная ошибка." };
	}
}

export async function deleteArpeggio(id: number): Promise<{ success: boolean; error?: string }> {
	try {
		await prisma.arpeggio.delete({
			where: { id },
		});

		revalidatePath("/admin/arpeggios");
		return { success: true };
	} catch (error: any) {
		console.error(`Ошибка удаления арпеджио ${id}:`, error);
		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2003") {
			return { success: false, error: "Невозможно удалить арпеджио, так как оно используется где-то еще." };
		}
		return { success: false, error: "Произошла ошибка при удалении." };
	}
}

export async function getArpeggioById(id: number) {
	try {
		const arpeggio = await prisma.arpeggio.findUnique({
			where: { id },
		});
		return arpeggio;
	} catch (error) {
		console.error(`Ошибка получения арпеджио ${id}:`, error);
		return null;
	}
}

export async function getAllArpeggios() {
	try {
		const arpeggios = await prisma.arpeggio.findMany({
			orderBy: {
				name: "asc",
			},
		});
		return arpeggios;
	} catch (error) {
		console.error("Ошибка получения арпеджио:", error);
		return [];
	}
}