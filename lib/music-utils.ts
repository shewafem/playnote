// lib/musicUtils.ts

import { Midi } from "tonal";
import { NoteValue, NoteObject } from "./types";

export const NOTE_NAMES: string[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const MAX_FRETS: number = 20;

export const DEFAULT_FRETS: number = 12;

const transformNotesToMidi = (notes: string[]): number[] => {
	const midiValues: (number | null)[] = notes.map((note) => Midi.toMidi(note));
	return midiValues.filter((midi): midi is number => midi !== null).reverse();
};

export const GUITAR_TUNINGS_MIDI: { [key: string]: number[] } = {
	"Стандартный (E-A-D-G-B-E)": transformNotesToMidi(["E2", "A2", "D3", "G3", "B3", "E4"]),
	"Drop D (D-A-D-G-B-E)": transformNotesToMidi(["D2", "A2", "D3", "G3", "B3", "E4"]),
	"Open G (D-G-D-G-B-D)": transformNotesToMidi(["D2", "G2", "D3", "G3", "B3", "D4"]),
	"Open D (D-A-D-F♯-A-D)": transformNotesToMidi(["D2", "A2", "D3", "F#3", "A3", "D4"]),
	DADGAD: transformNotesToMidi(["D2", "A2", "D3", "G3", "A3", "D4"]),
	"E♭ (E♭-A♭-D♭-G♭-B♭-E♭)": transformNotesToMidi(["Eb2", "Ab2", "Db3", "Gb3", "Bb3", "Eb4"]),
	"Yvette (F-A-C-G-B-E)": transformNotesToMidi(["F2", "A2", "C3", "G3", "B3", "E4"]),
};

export const GUITAR_TUNING_DEFAULT = Object.values(GUITAR_TUNINGS_MIDI)[0];

//(0-11)
export function getNoteValue(noteName: string): NoteValue | undefined {
	const value = NOTE_NAMES.indexOf(noteName.toUpperCase());
	return value !== -1 ? (value as NoteValue) : undefined;
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

export function getFretboardNoteMIDI(stringIndex: number, fretNumber: number, tuning = GUITAR_TUNING_DEFAULT): number {
	if (stringIndex < 0 || stringIndex >= tuning.length) {
		return -1;
	}
	// Validate fret number
	if (fretNumber < 0 || fretNumber > MAX_FRETS) {
		console.warn(`Неверное количество ладов: ${fretNumber}`);
	}

	const openStringMIDI = tuning[stringIndex];
	return openStringMIDI + fretNumber;
}

export const SHAPES: { [key: string]: { [key: string]: NoteValue[] } } = {
	Гаммы: {
		Мажор: [0, 2, 4, 5, 7, 9, 11],
		"Натуральный Минор": [0, 2, 3, 5, 7, 8, 10],
		"Гармонический Минор": [0, 2, 3, 5, 7, 8, 11],
		"Мелодический Минор": [0, 2, 3, 5, 7, 9, 11],
		"Мажорная Пентатоника": [0, 2, 4, 7, 9],
		"Минорная Пентатоника": [0, 3, 5, 7, 10],
		Блюз: [0, 3, 5, 6, 7, 10],
		Дорийский: [0, 2, 3, 5, 7, 9, 10],
		Фригийский: [0, 1, 3, 5, 7, 8, 10],
		Лидийский: [0, 2, 4, 6, 7, 9, 11],
		Миксолидийский: [0, 2, 4, 5, 7, 9, 10],
		Локрийский: [0, 1, 3, 5, 6, 8, 10],
		Целотон: [0, 2, 4, 6, 8, 10],
		Хроматический: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
		"Уменьшенный (H-W)": [0, 1, 3, 4, 6, 7, 9, 10],
		Альтерированный: [0, 1, 3, 4, 6, 8, 10],
		"Лидийский Доминант": [0, 2, 4, 6, 7, 9, 10],
		"Мажорный Бебоп": [0, 2, 4, 5, 7, 8, 9, 11],
		"Минорный Бебоп": [0, 2, 3, 5, 7, 9, 10, 11],
		"Доминантный Бебоп": [0, 2, 4, 5, 7, 9, 10, 11],
	},

	Аккорды: {
		"Major 7": [0, 4, 7, 11],
		"Minor 7": [0, 3, 7, 10],
		"Dominant 7": [0, 4, 7, 10],
		"Minor 7b5": [0, 3, 6, 10],
		"Diminished 7": [0, 3, 6, 9],
		"Augmented Major 7": [0, 4, 8, 11],
		"Augmented 7": [0, 4, 8, 10],
		"Minor Major 7": [0, 3, 7, 11],
	},
};

export function getNoteValuesInShape(rootNoteValue: NoteValue, shapeType: string, shapeName: string): Set<NoteValue> {
	const shape = SHAPES[shapeType]?.[shapeName];
	if (!shape) {
		console.warn(`Схема не найдена: ${shapeType} - ${shapeName}`);
		return new Set();
	}

	const noteValues = shape.map((interval) => ((rootNoteValue + interval) % 12) as NoteValue);
	return new Set(noteValues);
}

export function mapIdsToNoteObjects(ids: string[], tuning = GUITAR_TUNING_DEFAULT): NoteObject[] {
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
