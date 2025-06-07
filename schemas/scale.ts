// lib/schemas/scale.ts
import { z } from 'zod';

const parseIntegerArray = (value: string) => value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));

export const ScaleSchema = z.object({
  name: z.string().min(1, "Scale name is required (e.g., Major, Minor Pentatonic)"),
  formula: z.string()
    .min(1, "Formula is required (comma-separated integers, e.g., 0,2,4,5,7,9,11)")
    .transform(parseIntegerArray)
    .refine(arr => arr.length > 0, "At least one interval is required"),
});

export type ScaleFormData = z.infer<typeof ScaleSchema>;

export const ScaleFormSchema = z.object({
    name: z.string().min(1, "Scale name is required"),
    formula: z.string().min(1, "Formula is required (comma-separated integers)"),
});
export type ScaleFormInput = z.infer<typeof ScaleFormSchema>;