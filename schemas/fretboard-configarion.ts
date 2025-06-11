// @/schemas/fretboard-configuration.ts
import { z } from "zod";

export const FretboardConfigurationSchema = z.object({
	name: z.string().min(1, "Укажите название схемы"),
	configuration: z.string().min(1, "Схема не может быть пустой"),
	imageData: z.string().optional(), // Base64
});

export type FretboardConfiguration = z.infer<typeof FretboardConfigurationSchema>;