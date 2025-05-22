export type NoteValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11; // 0=C, 1=C#, ..., 11=B

export interface NoteObject {
  id: string; // "stringIdx-fretNum"
  note: string; // "C4"
}