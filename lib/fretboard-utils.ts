import { Midi } from "tonal";

export type NoteValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface NoteObject {
	id: string; // "#струны-#лада"
	note: string; // "C4"
}

export type ShapeFormulas = { [name: string]: NoteValue[] };
export type ShapesObjectType = { [type: string]: ShapeFormulas };
export type TuningsMidiObjectType = { [name: string]: number[] };

export const NOTE_NAMES: string[] = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];

export const MAX_FRETS: number = 24;
export const MIN_DISPLAYED_FRETS_COUNT = 1;
export const MIN_FRETS: number = 0;

export const DEFAULT_FRETS: number = 12;

export const transformNotesToMidi = (notes: string[]): number[] => {
	const midiValues: (number | null)[] = notes.map((note) => Midi.toMidi(note)).reverse();
	return midiValues.filter((midi): midi is number => midi !== null);  
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

	const openStringMIDI = tuning[stringIndex]; // допустим стадарт открытая 0 струна tuning[0] = 40 (midi E)
	return openStringMIDI + fretNumber;
}

export function getNoteValuesInShape( 
    rootNoteValue: NoteValue, //C
    shapeType: string,
    shapeName: string,
    allShapes: ShapesObjectType
): Set<NoteValue> {
	const shape = allShapes[shapeType]?.[shapeName];
	if (!shape) {
		return new Set();
	}
	const noteValues = shape.map((interval) => ((rootNoteValue + interval) % 12) as NoteValue); // [0, 1, 2, 3] -> [C, C#, D, D#]
	return new Set(noteValues);
}

export function mapIdsToNoteObjects(ids: string[], tuning: number[]): NoteObject[] {
	return ids
		.map((id) => {
			const parts = id.split("-");
			const [s, f] = parts.map(Number);
			const midi = getFretboardNoteMIDI(s, f, tuning);
			const noteNameWithOctave = midiToNoteName(midi);
			return { id: id, note: noteNameWithOctave };
		})
		.filter((obj): obj is NoteObject => obj !== null);
}

export function getDisplayStringFromQuery(queryString: string) {
    if (!queryString || queryString.trim() === '' || queryString.trim() === '?') {
        return ""; 
    }
    const paramsString = queryString.startsWith('?') ? queryString.substring(1) : queryString;
    const searchParams = new URLSearchParams(paramsString);
    const values = Array.from(searchParams.values());
    return values.join(', ');
}