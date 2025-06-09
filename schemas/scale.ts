// lib/schemas/scale.ts
import { z } from 'zod';

const parseIntegerArray = (value: string) => value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));

export const ScaleSchema = z.object({
  name: z.string().min(1, "Укажите название (Мажорная гамма)"),
  formula: z.string()
    .min(1, "Укажите формулу (ноты через запятую: 0,2,4,5,7,9,11)")
    .transform(parseIntegerArray)
    .refine(arr => arr.length > 0, "Хотя бы один интервал"),
});

export type ScaleFormData = z.infer<typeof ScaleSchema>;

export const ScaleFormSchema = z.object({
    name: z.string().min(1, "Укажите название"),
    formula: z.string().min(1, "Формула (0,2,4,5,7,9,11)"),
});
export type ScaleFormInput = z.infer<typeof ScaleFormSchema>;