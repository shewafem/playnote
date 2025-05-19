// lib/types.ts

export type NoteValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11; // 0=C, 1=C#, ..., 11=B

export interface NoteObject {
  id: string; // Unique identifier like "stringIdx-fretNum"
  note: string; // Note name with octave, e.g., "C4"
}

// Define structure for SHAPES if needed externally, otherwise it can stay internal to musicUtils
// export type ShapeNotes = number[]; // Array of semitone intervals from root
// export interface Shapes {
//   scales: { [key: string]: ShapeNotes };
//   arpeggios: { [key: string]: ShapeNotes };
//   // Add other types if necessary
// }