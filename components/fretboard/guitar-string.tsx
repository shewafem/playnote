// components/interactive-fretboard/guitar-string.tsx
import React from "react";
import Fret from "./fret";
import { DEFAULT_FRETS, GUITAR_TUNING_DEFAULT } from "@/lib/music-utils";
import { NoteValue } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GuitarStringProps {
	stringIndex: number;
	highlightedNotes: Set<NoteValue>;
	rootNoteValue: NoteValue;
	selectedNotesForPlayback: Set<string>;
	currentlyPlayingNoteId: string | null;
	isSelectingMode: boolean;
	onNoteClick?: (value: string) => void;
	isToneReady: boolean;
  selectedTuning: string;
}

const GuitarString: React.FC<GuitarStringProps> = ({
	stringIndex,
	highlightedNotes,
	rootNoteValue,
	selectedNotesForPlayback,
	currentlyPlayingNoteId,
	isSelectingMode,
	onNoteClick,
	isToneReady,
  selectedTuning,
}) => {
	// обратный порядок
	const displayStringIndex = GUITAR_TUNING_DEFAULT.length - 1 - stringIndex;

	return (
		<div
			className={cn("flex items-center gap-4 h-10 relative", "border-b-2 border-gray-500", {
				"last:border-b-0": displayStringIndex === 0,
			})}
		>
			{[...Array(DEFAULT_FRETS + 1)].map((_, fretNumber) => (
				<Fret
					key={fretNumber}
					stringIndex={stringIndex}
					fretNumber={fretNumber}
					highlightedNotes={highlightedNotes}
					rootNoteValue={rootNoteValue}
					selectedNotesForPlayback={selectedNotesForPlayback}
					currentlyPlayingNoteId={currentlyPlayingNoteId}
					isSelectingMode={isSelectingMode}
					onNoteClick={onNoteClick}
					isToneReady={isToneReady}
          selectedTuning={selectedTuning}
				/>
			))}
		</div>
	);
};

export default GuitarString;
