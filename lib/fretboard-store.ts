import { create } from "zustand";
import { DEFAULT_FRETS, MAX_FRETS, MIN_DISPLAYED_FRETS_COUNT, MIN_FRETS } from "./fretboard-utils";
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
}

export const useFretboardStore = create<FretboardStore>((set, get) => ({
	selectedKey: "C",
	setSelectedKey: (key) => set({ selectedKey: key }),

	selectedShapeType: "Гаммы",
	setSelectedShapeType: (type) => set({ selectedShapeType: type }),

	selectedShapeName: "Хроматическая",
	setSelectedShapeName: (name) => set({ selectedShapeName: name }),

	selectedTuning: "Стандартный (E-A-D-G-B-E)",
	setSelectedTuning: (tuning) => set({ selectedTuning: tuning }),

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

	startFret: MIN_FRETS, // Начальное значение
	endFret: DEFAULT_FRETS, // Начальное значение

	setStartFret: (newStartFret) => {
		const currentEndFret = get().endFret;
		let clampedStartFret = Math.max(Number(newStartFret), MIN_FRETS);
		// startFret не должен быть больше endFret минус (минимальное количество отображаемых ладов - 1)
		// И endFret не должен превышать ABSOLUTE_MAX_FRET
		clampedStartFret = Math.min(clampedStartFret, currentEndFret - MIN_DISPLAYED_FRETS_COUNT + 1);
		clampedStartFret = Math.min(clampedStartFret, MAX_FRETS - MIN_DISPLAYED_FRETS_COUNT + 1);

		if (!isNaN(clampedStartFret)) {
			set({ startFret: clampedStartFret });
		}
	},

	setEndFret: (newEndFret) => {
		const currentStartFret = get().startFret;
		let clampedEndFret = Math.min(Number(newEndFret), MAX_FRETS);
		// endFret не должен быть меньше startFret плюс (минимальное количество отображаемых ладов - 1)
		clampedEndFret = Math.max(clampedEndFret, currentStartFret + MIN_DISPLAYED_FRETS_COUNT - 1);

		if (!isNaN(clampedEndFret)) {
			set({ endFret: clampedEndFret });
		}
	},
}));
