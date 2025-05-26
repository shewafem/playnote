export type NoteValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

export interface NoteObject {
  id: string; // "stringIdx-fretNum"
  note: string; // "C4"
}