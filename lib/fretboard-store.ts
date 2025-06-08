import { create } from "zustand";
import { DEFAULT_FRETS, MAX_FRETS, MIN_FRETS, ShapesObjectType, TuningsMidiObjectType } from "./fretboard-utils";
//import { NoteValue } from "./fretboard-utils";

export interface FretboardStore {
	//selectedRootNoteValue: NoteValue;
	//setSelectedRootNoteValue: (noteValue: NoteValue) => void;

	selectedKey: string;
	setSelectedKey: (key: string) => void;

	selectedShapeType: string;
	setSelectedShapeType: (type: string) => void;

	selectedShapeName: string;
	setSelectedShapeName: (name: string) => void;

	selectedTuning: string;
	setSelectedTuning: (tuning: string) => void;

	isToneReady: boolean;
	setIsToneReady: (ready: boolean) => void;

	isSelectingNotes: boolean;
	setIsSelectingNotes: (selecting: boolean) => void;

	currentlySelectingNotes: string[];
	setCurrentlySelectingNotes: (notes: string[]) => void;

	selectedNotesForPlayback: string[];
	setSelectedNotesForPlayback: (notes: string[]) => void;

	bpm: number;
	setBpm: (bpm: number) => void;

	isPlayingSequence: boolean;
	setIsPlayingSequence: (playing: boolean) => void;

	currentPlaybackType: string | null;
	setCurrentPlaybackType: (type: string | null) => void;

	currentlyPlayingNoteId: string | null;
	setCurrentlyPlayingNoteId: (id: string | null) => void;

	toggleNoteSelection: (id: string) => void;
	resetSelection: () => void;
	confirmSelection: () => void;

	startFret: number;
	setStartFret: (startFret: number) => void;

	endFret: number;
	setEndFret: (endFret: number) => void;

  allShapes: ShapesObjectType | null;
	setAllShapes: (shapes: ShapesObjectType) => void;

	allTunings: TuningsMidiObjectType | null;
	setAllTunings: (tunings: TuningsMidiObjectType) => void;
}

export const useFretboardStore = create<FretboardStore>((set, get) => ({
	selectedKey: "C",
	setSelectedKey: (key) => set({ selectedKey: key }),

	selectedShapeType: "Гаммы",
	setSelectedShapeType: (type) => set({ selectedShapeType: type }),

	selectedShapeName: "Хроматическая", //get().allShapes[get().selectedShapeType][0],
	setSelectedShapeName: (name) => set({ selectedShapeName: name }),

	selectedTuning: "E Стандартный (E-A-D-G-B-E)",
	setSelectedTuning: (tuning) => set({ selectedTuning: tuning }),

  allShapes: null,
	setAllShapes: (shapes) => set({ allShapes: shapes }),

	allTunings: null,
	setAllTunings: (tunings) => set({ allTunings: tunings }),

	isToneReady: false,
	setIsToneReady: (ready) => set({ isToneReady: ready }),

	isSelectingNotes: false,
	setIsSelectingNotes: (selecting) => set({ isSelectingNotes: selecting }),

	currentlySelectingNotes: [],
	setCurrentlySelectingNotes: (notes) => set({ currentlySelectingNotes: notes }),

	selectedNotesForPlayback: [],
	setSelectedNotesForPlayback: (notes) => set({ selectedNotesForPlayback: notes }),

	bpm: 120,
	setBpm: (bpm) => set({ bpm }),

	isPlayingSequence: false,
	setIsPlayingSequence: (playing) => set({ isPlayingSequence: playing }),

	currentPlaybackType: null,
	setCurrentPlaybackType: (type) => set({ currentPlaybackType: type }),

	currentlyPlayingNoteId: null,
	setCurrentlyPlayingNoteId: (id) => set({ currentlyPlayingNoteId: id }),

	toggleNoteSelection: (id) => {
		const prev = get().currentlySelectingNotes;
		if (prev.includes(id)) {
			set({ currentlySelectingNotes: prev.filter((n) => n !== id) });
		} else {
			set({ currentlySelectingNotes: [...prev, id] });
		}
	},

	resetSelection: () => {
		set({ currentlySelectingNotes: [], selectedNotesForPlayback: [], currentlyPlayingNoteId: null });
	},

	confirmSelection: () => {
		set({ selectedNotesForPlayback: get().currentlySelectingNotes, isSelectingNotes: false });
	},

	startFret: MIN_FRETS,
	endFret: DEFAULT_FRETS,

	setStartFret: (newStartFret) => {
		const currentEndFret = get().endFret;
		let clampedStartFret = Math.max(Number(newStartFret), MIN_FRETS);
		clampedStartFret = Math.min(clampedStartFret, currentEndFret);
		clampedStartFret = Math.min(clampedStartFret, MAX_FRETS);

		if (!isNaN(clampedStartFret)) {
			set({ startFret: clampedStartFret });
		}
	},

	setEndFret: (newEndFret) => {
		const currentStartFret = get().startFret;
		let clampedEndFret = Math.min(Number(newEndFret), MAX_FRETS);
		clampedEndFret = Math.max(clampedEndFret, currentStartFret);

		if (!isNaN(clampedEndFret)) {
			set({ endFret: clampedEndFret });
		}
	},
}));
