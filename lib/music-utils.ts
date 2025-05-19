// lib/musicUtils.ts

import { Midi } from "tonal";
import { NoteValue, NoteObject } from "./types"; // Assuming types are defined here

export const NOTE_NAMES: string[] = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export const MAX_FRETS: number = 20;

export const DEFAULT_FRETS: number = 12; 

const transformNotesToMidi = (notes: string[]): number[] => {
  const midiValues: (number | null)[] = notes.map((note) => Midi.toMidi(note));
  return midiValues.filter((midi): midi is number => midi !== null).reverse();
};

export const GUITAR_TUNINGS_MIDI: { [key: string]: number[] } = {
  "Standard (E A D G B E)": transformNotesToMidi(["E2", "A2", "D3", "G3", "B3", "E4"]),
  "Drop D (D A D G B E)": transformNotesToMidi(["D2", "A2", "D3", "G3", "B3", "E4"]),
  "Open G (D G D G B D)": transformNotesToMidi(["D2", "G2", "D3", "G3", "B3", "D4"]),
  "Open D (D A D F# A D)": transformNotesToMidi(["D2", "A2", "D3", "F#3", "A3", "D4"]),
  "DADGAD": transformNotesToMidi(["D2", "A2", "D3", "G3", "A3", "D4"]),
  "Half step down (Eb Ab Db Gb Bb Eb)": transformNotesToMidi(["Eb2", "Ab2", "Db3", "Gb3", "Bb3", "Eb4"]),
};

export const GUITAR_TUNING_DEFAULT: number[] = GUITAR_TUNINGS_MIDI["Standard (E A D G B E)"];

//(0-11)
export function getNoteValue(noteName: string): NoteValue | undefined {
  const value = NOTE_NAMES.indexOf(noteName.toUpperCase());
  return value !== -1 ? (value as NoteValue) : undefined;
}

//(C, C#, ...)
export function getNoteName(noteValue: number): string {
  return NOTE_NAMES[noteValue  % 12];
}

export function midiToNoteName(midiNumber: number): string | null {
  if (midiNumber < 0 || midiNumber > 127) {
    return null;
  }
  return Midi.midiToNoteName(midiNumber, { sharps: true });
}

export function getFretboardNoteMIDI(stringIndex: number, fretNumber: number, tuning: number[] = GUITAR_TUNING_DEFAULT): number {
  if (stringIndex < 0 || stringIndex >= tuning.length) {
    return -1;
  }
  // Validate fret number
  if (fretNumber < 0 || fretNumber > MAX_FRETS) { // Use MAX_FRETS here
     // console.warn(`Invalid fret number: ${fretNumber}`); // Optional warning
     // Depending on desired behavior, could return -1 or calculate anyway.
     // Let's calculate anyway, but validate index.
  }

  const openStringMIDI = tuning[stringIndex];
  return openStringMIDI + fretNumber;
}

export const SHAPES: { [key: string]: { [key: string]: NoteValue[] } } = {
  "Гаммы": {
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

  "Ноты": {
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


// Get a Set of highlighted pitch classes (0-11) based on root and shape
export function getNoteValuesInShape(rootNoteValue: NoteValue, shapeType: string, shapeName: string): Set<NoteValue> {
  const shape = SHAPES[shapeType]?.[shapeName];
  if (!shape) {
     // console.warn(`Shape not found: ${shapeType} - ${shapeName}`); // Optional warning
    return new Set();
  }

  const noteValues = shape.map((interval) => ((rootNoteValue + interval) % 12) as NoteValue);
  return new Set(noteValues);
}

// Helper to map selected identifiers ("s-f") to note objects { id: string, note: string | null }
// This helper needs to be updated to reflect the potential null from midiToNoteName
export function mapIdsToNoteObjects(ids: string[]): NoteObject[] {
  if (!Array.isArray(ids)) {
    console.error("mapIdsToNoteObjects was called with a non-array value:", ids);
    return [];
  }

  return ids
    .map((id) => {
      if (typeof id !== "string" || !id.includes("-")) {
        console.warn(`Skipping invalid identifier in mapIdsToNoteObjects: ${id}`);
        return null;
      }
      const parts = id.split("-");
      if (parts.length !== 2) {
        console.warn(`Skipping identifier with incorrect parts: ${id}`);
        return null;
      }
      const [s, f] = parts.map(Number);
      if (isNaN(s) || isNaN(f)) {
        console.warn(`Skipping identifier with non-numeric parts: ${id}`);
        return null;
      }

      // Use the MAX_FRETS defined in this file if needed for validation,
      // although getFretboardNoteMIDI already handles basic bounds.
      const midi = getFretboardNoteMIDI(s, f);
      if (midi === -1) { // getFretboardNoteMIDI returns -1 for invalid string index
        console.warn(`Skipping identifier with invalid MIDI calculation (string index out of bounds?): ${id}`);
        return null;
      }
      // midiToNoteName can return null
      const noteNameWithOctave = midiToNoteName(midi);

      // Only return object if noteNameWithOctave is not null
      if (noteNameWithOctave === null) {
          console.warn(`Skipping identifier ${id} due to invalid MIDI->Note conversion for MIDI ${midi}`);
          return null;
      }

      return { id: id, note: noteNameWithOctave }; // Note is guaranteed string here
    })
    .filter((obj): obj is NoteObject => obj !== null); // Filter out nulls and assert type
}