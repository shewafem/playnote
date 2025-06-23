//определение инструмента для правильного рендера Chord из 'react-chords'
import { InstrumentType } from "./types";

export const keyNotes = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "B"];

export const guitar: InstrumentType = {
	strings: 6,
	fretsOnChord: 4,
	name: "Guitar",
	keys: [],
	tunings: {
		standard: ["E", "A", "D", "G", "B", "E"],
	},
};


//export const ruNotes = {
//	B: "H",
//	Bb: "B",
//};