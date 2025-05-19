export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export type RomanNumeral = "I" | "ii" | "iii" | "IV" | "V" | "vi" | "vii°";
export type ChordType = "Major" | "minor" | "diminished";

export interface Chord {
	numeral: RomanNumeral;
	type: ChordType;
	rootNote: string;
	displayName: string;
}

export enum DEGREES {
  "I" = 1,
  "ii" = 2,
  "iii" = 3,
  "IV" = 4,
  "V" = 5,
  "vi" = 6,
  "vii°" = 7,
}
export interface ScaleChord extends Chord {
	degree: number; // 1-7
}

const MAJOR_SCALE_CHORD_QUALITIES: { numeral: RomanNumeral; type: ChordType }[] = [
	{ numeral: "I", type: "Major" },
	{ numeral: "ii", type: "minor" },
	{ numeral: "iii", type: "minor" },
	{ numeral: "IV", type: "Major" },
	{ numeral: "V", type: "Major" },
	{ numeral: "vi", type: "minor" },
	{ numeral: "vii°", type: "diminished" },
];

export const getMajorScaleNotes = (rootNote: string): string[] => {
	const rootIndex = NOTES.indexOf(rootNote);
	if (rootIndex === -1) throw new Error("Неверная тоника");

	const scaleSteps = [0, 2, 4, 5, 7, 9, 11]; //(W-W-H-W-W-W-H)
	return scaleSteps.map((step) => NOTES[(rootIndex + step) % NOTES.length]);
};

export const getDiatonicChords = (rootNote: string): ScaleChord[] => {
	const scaleNotes = getMajorScaleNotes(rootNote);
	return MAJOR_SCALE_CHORD_QUALITIES.map((quality, index) => {
		const chordRootNote = scaleNotes[index];
		let displayName = chordRootNote;
		if (quality.type === "minor") displayName += "m";
		if (quality.type === "diminished") displayName += "°";

		return {
			...quality,
			degree: index + 1,
			rootNote: chordRootNote,
			displayName: displayName,
		};
	});
};

export const POPULAR_PROGRESSIONS: { name: string; progression: RomanNumeral[] }[] = [
	{ name: "Классический поп", progression: ["I", "V", "vi", "IV"] },
	{ name: "Прогрессия 50-ых", progression: ["I", "vi", "IV", "V"] },
	{ name: "Блюз (12-тактовый)", progression: ["I", "I", "I", "I", "IV", "IV", "I", "I", "V", "IV", "I", "V"] },
	{ name: "Джазовая стандартная", progression: ["ii", "V", "I"] },
	{ name: "Поп в миноре", progression: ["vi", "IV", "I", "V"] },
	{ name: "Модерн поп", progression: ["IV", "I", "V", "vi"] },
	{ name: "Грустный поп", progression: ["vi", "I", "V", "IV"] },
	{ name: "Баллада", progression: ["I", "vi", "ii", "V"] },
	{ name: "Церковная каденция", progression: ["IV", "I"] },
	{ name: "Автентическая каденция", progression: ["V", "I"] },
];

export const getRandomProgression = (maxLength: number = 4): RomanNumeral[] => {
	const availableNumerals: RomanNumeral[] = ["I", "ii", "iii", "IV", "V", "vi"];
	const length = Math.floor(Math.random() * (maxLength - 2)) + 3;
	const progression: RomanNumeral[] = [];
	for (let i = 0; i < length; i++) {
		progression.push(availableNumerals[Math.floor(Math.random() * availableNumerals.length)]);
	}
	if (Math.random() > 0.3 && progression.length > 0) {
		progression[0] = Math.random() > 0.5 ? "I" : "vi";
	}
	return progression;
};
