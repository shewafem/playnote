import { z } from 'zod';

export const PositionSchema = z.object({
  name: z.string().min(1, 'Укажите название аккорда'),
  formula: z.string().min(1, 'Укажите формулу аккорда'),
});

export const TuningSchema = z.object({
  name: z.string().min(1, 'Укажите название тюнинга'),
  notes: z.string().min(1, 'Укажите ноты тюнинга'),
});

export const ScaleSchema = z.object({
  name: z.string().min(1, 'Укажите название гаммы'),
  formula: z.string().min(1, 'Укажите формулу гаммы'),
});

export const ArpeggioSchema = z.object({
  name: z.string().min(1, 'Укажите название арпеджио'),
  formula: z.string().min(1, 'Укажите формулу арпеджио'),
});