// Определение типов
//Для react-chords передаем для рендера аккордов

export type Position = {
	frets: number[];
	fingers: number[];
	baseFret: number;
	barres: number[];
	midi: number[];
	capo?: boolean;
};

//тип аккорда из базы данных
export type Chord = {
	key: string;
	suffix: string;
	positions: Position[];
};

//Запись в виде "C": ["key": "C", suffix: "major", positions: Position[], ...]
export type ChordRecord = Record<string, Chord[]>;

//тип для инструмента
export type InstrumentType = {
	strings: number;
	fretsOnChord: number;
	name: "Guitar" | "Ukulele";
	keys: string[];
	tunings: {
		standard: string[];
	};
};