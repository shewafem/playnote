// lib/schemas/arpeggio.ts
import { z } from 'zod';

const parseIntegerArray = (value: string) => value.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));

export const ArpeggioSchema = z.object({
  name: z.string().min(1, "Arpeggio name is required (e.g., Major Triad, Minor 7th)"),
  formula: z.string()
    .min(1, "Formula is required (comma-separated integers, e.g., 0,4,7)")
    .transform(parseIntegerArray)
    .refine(arr => arr.length > 0, "At least one interval is required"),
});

export type ArpeggioFormData = z.infer<typeof ArpeggioSchema>;

export const ArpeggioFormSchema = z.object({
    name: z.string().min(1, "Arpeggio name is required"),
    formula: z.string().min(1, "Formula is required (comma-separated integers)"),
});
export type ArpeggioFormInput = z.infer<typeof ArpeggioFormSchema>;