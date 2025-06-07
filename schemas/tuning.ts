// lib/schemas/tuning.ts
import { z } from 'zod';

const parseStringArray = (value: string) => value.split(',').map(s => s.trim()).filter(s => s.length > 0);

export const TuningSchema = z.object({
  name: z.string().min(1, "Укажите название"),
  notes: z.string()
    .min(1, "Укажите ноты через запятую)")
    .transform(parseStringArray)
    .refine(arr => arr.length > 0, "Укажите хотя бы одну ноту"),
});

export type TuningFormData = z.infer<typeof TuningSchema>;

// For form default values
export const TuningFormSchema = z.object({
    name: z.string().min(1, "Укажите название строя"),
    notes: z.string().min(1, "Укажите названия нот через запятую"),
});
export type TuningFormInput = z.infer<typeof TuningFormSchema>;

export interface ServerActionError {
  formErrors?: string[];
  fieldErrors?: Record<string, string[]>;
  message?: string;
}