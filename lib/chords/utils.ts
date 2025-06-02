// Структура базы данных:
// {
//   "C": [
//     { key: "C", suffix: "major", positions: [...] }, // Аккорд c тональностью, суффиксом и позициями
//     { key: "C", suffix: "minor", positions: [...] },
//     ...
//   ],
//   "C#": [...],
//   "D": [...],
//   ...
// }

import prisma from "@/lib/prisma"
import { ChordWithPositions } from "./types";

export function formatItem(item: string): string {
  if (item === undefined) {
    return item;
  }
  const formattedItem = item.replace(/sharp/g, "#").replace(/over/g, "/");
  return formattedItem;
}

export async function getChordsByKey(key: string): Promise<ChordWithPositions[]> {
	const formattedKey = formatItem(key);
	try {
		const chordsFromDb = await prisma.chord.findMany({
			where: {
				key: formattedKey,
			},
			include: {
				positions: true,
			},
		});
		return chordsFromDb;
	} catch (error) {
		console.error(`Ошибка получения аккордов по тональности ${formattedKey} из БД:`, error);
		throw new Error(`Ошибка получения аккордов по тональности ${formattedKey} из БД`);
	}
}

export async function getChord(key: string, suffix: string): Promise<ChordWithPositions | undefined> {
	const formattedKey = formatItem(key);
	try {
		const chordFromDb = await prisma.chord.findUnique({
			where: {
				// Используем имя уникального индекса, которое Prisma генерирует по умолчанию
				// для @@unique([key, suffix]) это key_suffix
				key_suffix: {
					key: formattedKey,
					suffix: suffix,
				},
			},
			include: {
				positions: true,
			},
		});

		if (!chordFromDb) {
			return undefined;
		}
		return chordFromDb;
	} catch (error) {
		console.error(`Ошибка получения аккорда ${formattedKey} ${suffix} из БД:`, error);
		throw new Error(`Ошибка получения аккорда ${formattedKey} ${suffix} из БД`);
	}
}

export async function getSuffixes(key: string): Promise<string[]> {
	const formattedKey = formatItem(key);
	try {
		const chordsWithSuffixes = await prisma.chord.findMany({
			where: {
				key: formattedKey,
			},
			select: {
				// Запрашиваем только поле suffix для эффективности
				suffix: true,
			}, // Убедимся, что суффиксы уникальны, если это возможно (зависит от версии Prisma и БД)
			// Если distinct на уровне поля не работает, можно сделать .map().filter() в JS
		});
		// Если distinct не сработал как ожидалось или не поддерживается для select:
		// const uniqueSuffixes = Array.from(new Set(chordsWithSuffixes.map(chord => chord.suffix)));
		// return uniqueSuffixes;
		return chordsWithSuffixes.map((chord) => chord.suffix);
	} catch (error) {
		console.error(`Ошибка получения суффиксов для тональности ${formattedKey} из БД:`, error);
		throw new Error(`Ошибка получения суффиксов для тональности ${formattedKey} из БД`);
	}
}

export async function getChordsByKeyPaginated(
  key: string,
  skip: number,
  take: number
): Promise<{ chords: ChordWithPositions[]; totalCount: number }> {
  const formattedKey = formatItem(key);
  try {
    // Prisma transaction to get both data and count efficiently
    const [chordsFromDb, totalCount] = await prisma.$transaction([
      prisma.chord.findMany({
        where: { key: formattedKey },
        include: {
          positions: true,
        },
        skip: skip,
        take: take,
      }),
      prisma.chord.count({
        where: { key: formattedKey },
      }),
    ]);
    return { chords: chordsFromDb, totalCount };
  } catch (error) {
    console.error(`Ошибка получения пагинированных аккордов для тональности ${formattedKey} из БД:`, error);
    // It's better to throw or return a specific error structure
    throw new Error(`Ошибка получения пагинированных аккордов для тональности ${formattedKey}`);
  }
}

export async function getLearnedPositionIdsForChords(userId: string | undefined, chords: ChordWithPositions[]): Promise<number[]> {
	if (!userId || chords.length === 0) {
		return [];
	}
	const allPositionIds = chords.flatMap(chord => chord.positions.map(p => p.id));
	if (allPositionIds.length === 0) return [];

	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				learnedPositions: {
					where: { id: { in: allPositionIds } },
					select: { id: true },
				},
			},
		});
		return user?.learnedPositions.map((p) => p.id) || [];
	} catch (error) {
		console.error("Ошибка поулчения аккордов с позициями:", error);
		return [];
	}
}
