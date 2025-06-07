// lib/musicUtils.ts

import { Midi } from "tonal";

export type NoteValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface NoteObject {
	id: string; // "stringIdx-fretNum"
	note: string; // "C4"
}

export type ShapeFormulas = { [name: string]: NoteValue[] };
export type ShapesObjectType = { [type: string]: ShapeFormulas }; // e.g., { "Гаммы": { "Мажор": [...] }, "Арпеджио": { ... } }
export type TuningsMidiObjectType = { [name: string]: number[] }; // e.g., { "Стандартный": [midi1, midi2, ...] }

export const NOTE_NAMES: string[] = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

export const MAX_FRETS: number = 24;
export const MIN_DISPLAYED_FRETS_COUNT = 1;
export const MIN_FRETS: number = 0;

export const DEFAULT_FRETS: number = 12;

export const transformNotesToMidi = (notes: string[]): number[] => {
	const midiValues: (number | null)[] = notes.map((note) => Midi.toMidi(note));
	return midiValues.filter((midi): midi is number => midi !== null).reverse();
};

//(0-11)
export function getNoteValue(noteName: string): NoteValue {
	const value = NOTE_NAMES.indexOf(noteName.toUpperCase());
	return value as NoteValue;
}

//(C, C#, ...)
export function getNoteName(noteValue: number): string {
	return NOTE_NAMES[noteValue % 12];
}

export function midiToNoteName(midiNumber: number): string | null {
	if (midiNumber < 0 || midiNumber > 127) {
		return null;
	}
	return Midi.midiToNoteName(midiNumber, { sharps: true });
}

export function getFretboardNoteMIDI(stringIndex: number, fretNumber: number, tuning : number[]): number {
	if (stringIndex < 0 || stringIndex >= tuning.length) {
		return -1;
	}
	if (fretNumber < 0 || fretNumber > MAX_FRETS) {
		console.warn(`Неверное количество ладов: ${fretNumber}`);
	}

	const openStringMIDI = tuning[stringIndex];
	return openStringMIDI + fretNumber;
}

export function getNoteValuesInShape(
    rootNoteValue: NoteValue,
    shapeType: string,
    shapeName: string,
    allShapes: ShapesObjectType
): Set<NoteValue> {
	const shape = allShapes[shapeType]?.[shapeName];
	if (!shape) {
		return new Set();
	}
	const noteValues = shape.map((interval) => ((rootNoteValue + interval) % 12) as NoteValue);
	return new Set(noteValues);
}

export function mapIdsToNoteObjects(ids: string[], tuning: number[]): NoteObject[] {
	if (!Array.isArray(ids)) {
		return [];
	}

	return ids
		.map((id) => {
			if (typeof id !== "string" || !id.includes("-")) {
				return null;
			}
			const parts = id.split("-");
			if (parts.length !== 2) {
				return null;
			}
			const [s, f] = parts.map(Number);
			if (isNaN(s) || isNaN(f)) {
				return null;
			}

			const midi = getFretboardNoteMIDI(s, f, tuning);
			if (midi === -1) {
				return null;
			}
			const noteNameWithOctave = midiToNoteName(midi);

			if (noteNameWithOctave === null) {
				return null;
			}

			return { id: id, note: noteNameWithOctave };
		})
		.filter((obj): obj is NoteObject => obj !== null);
}