// components/interactive-fretboard/fret.tsx
import React from "react";
import NoteDot from "./note-dot";
import FretWire from "./fret-wire";
import { getFretboardNoteMIDI, DEFAULT_FRETS, GUITAR_TUNINGS_MIDI } from "@/lib/music-utils";
import { NoteValue } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FretProps {
	stringIndex: number;
	fretNumber: number;
	highlightedNotes: Set<NoteValue>;
	rootNoteValue: NoteValue | undefined;
	selectedNotesForPlayback: Set<string>; 
	currentlyPlayingNoteId: string | null;
	isSelectingMode: boolean;
	onNoteClick?: (value: string) => void;
	isToneReady: boolean;
  selectedTuning: string;
}

const Fret: React.FC<FretProps> = ({
	stringIndex,
	fretNumber,
	highlightedNotes,
	rootNoteValue,
	selectedNotesForPlayback,
  selectedTuning,
	currentlyPlayingNoteId,
	isSelectingMode,
	onNoteClick,
	isToneReady,
}) => {
  const tuning = GUITAR_TUNINGS_MIDI[selectedTuning]
	const midiValue = getFretboardNoteMIDI(stringIndex, fretNumber, tuning);

	const noteValue = (midiValue % 12) as NoteValue; //(0-11)
	const identifier = `${stringIndex}-${fretNumber}`; // ID

	const isScaleHighlighted = highlightedNotes.has(noteValue);
	const isRoot = isScaleHighlighted && noteValue === rootNoteValue;
	const isSelected = selectedNotesForPlayback.has(identifier);
	const isPlaying = identifier === currentlyPlayingNoteId;

	return (
		<div className={cn("relative flex items-center justify-center h-full", fretNumber === 0 ? "w-10" : "w-14")}>
			<NoteDot
				identifier={identifier}
				midiValue={midiValue}
				isHighlighted={isScaleHighlighted}
				isRoot={isRoot}
				isSelected={isSelected}
				isPlaying={isPlaying}
				isSelectingMode={isSelectingMode}
				onClick={onNoteClick}
				isToneReady={isToneReady}
			/>
			{fretNumber < DEFAULT_FRETS && <FretWire isNut={fretNumber === 0} />}
		</div>
	);
};

export default Fret;
