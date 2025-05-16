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

import { ChordRecord, Chord } from "./types";

// Кэш для всех аккордов определенной тональности (key)
let chordCache: ChordRecord | null = null;

// Получение всех аккордов
export async function getAllChords(): Promise<ChordRecord> {
	if (chordCache) {
		return chordCache; // Return cached data if available
	}
	try {
		// Import the chord data from the local JSON file
		const data = await import("./chords.json");
		chordCache = data.default as ChordRecord; // Store in cache
		return chordCache;
	} catch (error) {
		console.error("Ошибка получения аккордов:", error);
		throw new Error("Ошибка получения аккордов");
	}
}

export async function getChordsByKey(key: string): Promise<Chord[]> {
	try {
		const allChords = await getAllChords();
		return allChords[key] || [];
	} catch (error) {
		console.error(`Ошибка получения аккорда по тональности ${key}:`, error);
		throw new Error(`Ошибка получения аккорда по тональности ${key}`);
	}
}

export async function getChord(key: string, suffix: string): Promise<Chord | undefined> {
	try {
		const keyChords = await getChordsByKey(key);
		return keyChords.find((chord) => chord.suffix === suffix);
	} catch (error) {
		console.error(`Ошибка получения аккорда ${key} ${suffix}:`, error);
		throw new Error(`Ошибка получения аккорда ${key} ${suffix}`);
	}
}

export async function getSuffixes(key: string): Promise<string[]> {
  const keyChords = await getChordsByKey(formatItem(key))
  const suffixes = keyChords.map(chord => chord.suffix)
  return suffixes
}

export function formatItem(item: string) {
  if (item === undefined) return item
  const formattedItem = item.replace(/sharp/g, "#").replace(/over/g, "/")
  return formattedItem
}