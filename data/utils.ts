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

import { PrismaClient, Chord as PrismaGeneratedChord, Position as PrismaGeneratedPosition } from "@prisma/client";
// Импортируем ваши оригинальные типы для сохранения сигнатур функций
import { ChordRecord, Chord } from "./types";

const prisma = new PrismaClient();

// --- Вспомогательная функция для маппинга ---
// Prisma возвращает объекты со всеми полями, включая id, chordId.
// Эта функция приводит их к вашему типу `Chord` и `PositionItem`.
function mapPrismaChordToAppChord(prismaChord: PrismaGeneratedChord & { positions: PrismaGeneratedPosition[] }): Chord {
	return {
		key: prismaChord.key,
		suffix: prismaChord.suffix,
		positions: prismaChord.positions.map((p) => ({
			frets: p.frets,
			fingers: p.fingers,
			baseFret: p.baseFret,
			barres: p.barres,
			midi: p.midi,
			capo: p.capo === null ? undefined : p.capo, // Prisma null -> undefined для опционального поля
		})),
	};
}

export function formatItem(item: string): string {
	if (item === undefined) {
		return item;
	}
	const formattedItem = item.replace(/sharp/g, "#").replace(/over/g, "/");
	return formattedItem;
}

export async function getAllChords(): Promise<ChordRecord> {
	try {
		const allChordsFromDb = await prisma.chord.findMany({
			include: {
				positions: true,
			},
		});

		// Преобразуем плоский список аккордов в структуру ChordRecord
		const chordRecord: ChordRecord = {};
		allChordsFromDb.forEach((prismaChord) => {
			if (!chordRecord[prismaChord.key]) {
				chordRecord[prismaChord.key] = [];
			}
			chordRecord[prismaChord.key].push(mapPrismaChordToAppChord(prismaChord));
		});
		return chordRecord;
	} catch (error) {
		console.error("Ошибка получения всех аккордов из БД:", error);
		throw new Error("Ошибка получения всех аккордов из БД");
	}
}

export async function getChordsByKey(key: string): Promise<Chord[]> {
	const formattedKey = formatItem(key);
	try {
		const chordsFromDb = await prisma.chord.findMany({
			where: {
				key: formattedKey,
			},
			include: {
				positions: true,
			},
			orderBy: {
				// Опционально: для консистентного порядка суффиксов
				suffix: "asc",
			},
		});
		return chordsFromDb.map(mapPrismaChordToAppChord);
	} catch (error) {
		console.error(`Ошибка получения аккордов по тональности ${formattedKey} из БД:`, error);
		throw new Error(`Ошибка получения аккордов по тональности ${formattedKey} из БД`);
	}
}

export async function getChord(key: string, suffix: string): Promise<Chord | undefined> {
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
		return mapPrismaChordToAppChord(chordFromDb);
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

// Не забудьте, что для работы этого кода вам нужно:
// 1. Установить Prisma Client: npm install @prisma/client
// 2. Сгенерировать Prisma Client: npx prisma generate
// 3. Убедиться, что ваша база данных запущена и содержит данные.
//    Возможно, вам понадобится скрипт для заполнения (seed script) базы данных из вашего chords.json.
