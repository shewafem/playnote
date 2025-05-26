// components/interactive-fretboard/fretboard-display.tsx
import React from "react";
import GuitarString from "./guitar-string";
import FretNumbers from "./fret-numbers";
import { GUITAR_TUNINGS_MIDI } from "@/lib/fretboard-utils";
import { NoteValue } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FretboardDisplayProps {
	highlightedNotes: Set<NoteValue>;
	rootNoteValue: NoteValue;
	onNoteClick?: (value: string) => void;
	selectedNotesForPlayback: string[]; //идентификаторы ("s-f")
	currentlyPlayingNoteId: string | null;
	selectedTuning: string;
	isSelectingMode: boolean;
	isToneReady: boolean;
}

const FretboardDisplay: React.FC<FretboardDisplayProps> = ({
	highlightedNotes,
	rootNoteValue,
	onNoteClick,
	selectedNotesForPlayback,
	currentlyPlayingNoteId,
	isSelectingMode,
	selectedTuning,
	isToneReady,
}) => {
	//const numStrings = GUITAR_TUNING_DEFAULT.length;

	const tuning = GUITAR_TUNINGS_MIDI[selectedTuning];

	const selectedNotesSet = React.useMemo(() => new Set(selectedNotesForPlayback || []), [selectedNotesForPlayback]);

	return (
		<div className={cn("flex flex-col p-4 bg-card border border-border rounded-md relative shadow-lg", "w-fit")}>
			<FretNumbers />
			{tuning.map((_, stringIndex) => (
				<GuitarString
					key={stringIndex}
					stringIndex={stringIndex}
					highlightedNotes={highlightedNotes}
					rootNoteValue={rootNoteValue}
					selectedNotesForPlayback={selectedNotesSet}
					currentlyPlayingNoteId={currentlyPlayingNoteId}
					isSelectingMode={isSelectingMode}
					onNoteClick={isToneReady ? onNoteClick : undefined}
					isToneReady={isToneReady}
					selectedTuning={selectedTuning}
				/>
			))}
		</div>
	);
};

export default FretboardDisplay;
