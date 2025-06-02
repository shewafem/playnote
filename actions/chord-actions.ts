"use server";

import { auth } from "@/auth";
import { getChordsByKeyPaginated } from "@/lib/chords/utils";
import { ChordWithPositions } from "@/lib/chords/types"; 
import prisma from "@/lib/prisma";

interface FetchMoreChordsResult {
  newChords: ChordWithPositions[];
  newLearnedPositionIds: number[];
  error?: string;
}

async function getLearnedPositionIdsForGivenChords(userId: string | undefined, chords: ChordWithPositions[]): Promise<number[]> {
  if (!userId || chords.length === 0) {
    return [];
  }
  const allPositionIdsInChords = chords.flatMap(chord => chord.positions.map(p => p.id));
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