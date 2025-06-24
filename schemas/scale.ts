import { z } from "zod";

export const ScaleFormSchema = z.object({
	name: z.string().min(2, "Название должно содержать минимум 2 символа."),
	formula: z
		.string()
		.min(1, "Укажите формулу лада.")
		.regex(/^[\d,\s]+$/, "Формула может содержать только цифры, запятые и пробелы.")
		.refine((val) => val.split(",").some(s => s.trim() !== ""), "Формула не может быть пустой."),
});
export type ScaleFormData = z.infer<typeof ScaleFormSchema>;


export const ScaleDbSchema = ScaleFormSchema.extend({
	formula: ScaleFormSchema.shape.formula
		.transform((val) =>
			val
				.split(",")
				.map((s) => parseInt(s.trim(), 10))
				.filter((n) => !isNaN(n))
		)
		.refine((arr) => arr.length > 0, {
			message: "Формула должна содержать хотя бы одно число.",
		}),
});
export type ScaleDbInput = z.infer<typeof ScaleDbSchema>;

export interface ServerActionError {
	formErrors?: string[];
	fieldErrors?: Record<string, string[]>;
	message?: string;
}

export function formatFormulaForInput(formula: number[]): string {
    return formula.join(', ');
}