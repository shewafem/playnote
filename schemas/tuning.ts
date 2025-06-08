// lib/schemas/tuning.ts
import { z } from "zod";

const parseStringArrayForDB = (value: string) =>
	value
		.split(",")
		.map((s) => s.trim())
		.filter((s) => s.length > 0);
const NOTE_OCTAVE_REGEX = /^[A-Ga-g][#b]?[1-6]$/;

export const TuningSchema = z.object({
	name: z.string().min(1, "Укажите название"),
	notes: z
		.string()
		.min(1, "Укажите ноты через запятую")
		.transform(parseStringArrayForDB)
		.refine((arr) => arr.length > 0, "Укажите хотя бы одну ноту")
		.refine(
			(arr) => arr.every((note) => NOTE_OCTAVE_REGEX.test(note)),
			"Каждая нота должна быть в формате 'нота' (например, E2, A#4). Октавы от 1 до 6."
		),
});
export type TuningFormData = z.infer<typeof TuningSchema>; 

export const SingleNoteFieldSchema = z.object({
	note: z.string().min(1, "Выберите ноту"),
	octave: z.string().min(1, "Выберите октаву"),
});
export type SingleNoteField = z.infer<typeof SingleNoteFieldSchema>;

export const TuningFormShapeSchema = z.object({
	name: z.string().min(1, "Укажите название строя"),
	notes: z
		.array(SingleNoteFieldSchema)
		.min(1, "Добавьте хотя бы одну струну")
		.max(12, "Тюнинг может содержать не более 12 струн"),
});
export type TuningFormShape = z.infer<typeof TuningFormShapeSchema>; 

export const TuningFormInputSchema = z.object({
	name: z.string().min(1, "Укажите название строя"),
	notes: z.string().min(1, "Укажите названия нот через запятую"),
});
export type TuningFormInput = z.infer<typeof TuningFormInputSchema>;

export interface ServerActionError {
	formErrors?: string[];
	fieldErrors?: Record<string, string[] | Record<string, string[]>[]>; 
	message?: string;
}

export function parseNotesStringToFieldArray(notesString: string): SingleNoteField[] {
	if (!notesString) return [{ note: "E", octave: "4" }]; 
	return notesString
		.split(",")
		.map((s) => s.trim())
		.filter((s) => s.length > 1) 
		.map((noteStr) => {
			const match = noteStr.match(/^([A-Ga-g][#b]?)([1-6])$/);
			if (match) {
				return { note: match[1], octave: match[2] };
			}
			return { note: "E", octave: "4" }; 
		});
}

export function formatFieldArrayToNotesString(notesArray: SingleNoteField[]): string {
	return notesArray.map((n) => `${n.note}${n.octave}`).join(",");
}
