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

"use server";
import prisma from "@/lib/prisma";
import { ChordWithPositions } from "@/lib/chords/types";
import { formatItem } from "@/lib/chords/utils";
import { auth } from "@/auth";

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
        // для @@unique
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
        suffix: true,
      }, 
    });
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
    throw new Error(`Ошибка получения пагинированных аккордов для тональности ${formattedKey}`);
  }
}

export async function getLearnedPositionIdsForChords(
  userId: string | undefined,
  chords: ChordWithPositions[]
): Promise<number[]> {
  if (!userId || chords.length === 0) {
    return [];
  }
  const allPositionIds = chords.flatMap((chord) => chord.positions.map((p) => p.id)); //
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
    console.error("Ошибка получения аккордов с позициями:", error);
    return [];
  }
}

interface FetchMoreChordsResult {
	newChords: ChordWithPositions[];
	newLearnedPositionIds: number[];
	error?: string;
}

async function getLearnedPositionIdsForGivenChords(
	userId: string | undefined,
	chords: ChordWithPositions[]
): Promise<number[]> {
	if (!userId || chords.length === 0) {
		return [];
	}
	const allPositionIdsInChords = chords.flatMap((chord) => chord.positions.map((p) => p.id));
	if (allPositionIdsInChords.length === 0) return [];

	try {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: {
				learnedPositions: {
					where: { id: { in: allPositionIdsInChords } },
					select: { id: true },
				},
			},
		});
		return user?.learnedPositions.map((p) => p.id) || [];
	} catch (error) {
		console.error("Ошибка запроса аккорда с выученными позициями:", error);
		return [];
	}
}

export async function fetchMoreChordsAction(
	key: string,
	offset: number,
	limit: number
): Promise<FetchMoreChordsResult> {
	const session = await auth();
	const userId = session?.user?.id;

	try {
		const { chords: newChords } = await getChordsByKeyPaginated(key, offset, limit);

		const newLearnedPositionIds = await getLearnedPositionIdsForGivenChords(userId, newChords);

		return { newChords, newLearnedPositionIds };
	} catch (error) {
		console.error("Ошибка получения больше аккордов:", error);

		return { newChords: [], newLearnedPositionIds: [], error: "Не удалось загрузить больше аккордов." };
	}
}
