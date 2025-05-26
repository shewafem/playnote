export type InstrumentType = {
	strings: number;
	fretsOnChord: number;
	name: "Guitar" | "Ukulele";
	keys: string[];
	tunings: {
		standard: string[];
	};
};