// components/interactive-fretboard/guitar-string.tsx
import React from "react";
import Fret from "./fret";
import { GUITAR_TUNING_DEFAULT } from "@/lib/fretboard-utils";
import { NoteValue } from "@/lib/fretboard-utils";
import { cn } from "@/lib/utils";

interface GuitarStringProps {
	stringIndex: number;
	highlightedNotes: Set<NoteValue>;
	rootNoteValue: NoteValue;
	selectedNotesForPlayback: Set<string>;
	isSelectingMode: boolean;
	onNoteClick?: (value: string) => void;
	isToneReady: boolean;
	selectedTuning: string;
	fretCount: number;
}

const GuitarString: React.FC<GuitarStringProps> = ({
	stringIndex,
	highlightedNotes,
	rootNoteValue,
	selectedNotesForPlayback,
	isSelectingMode,
	onNoteClick,
	isToneReady,
	selectedTuning,
	fretCount,
}) => {
	// обратный порядок
	const displayStringIndex = GUITAR_TUNING_DEFAULT.length - 1 - stringIndex;

	return (
		<div
			className={cn("flex items-center h-10", "border-b-2 border-gray-500", {
				"last:border-b-0": displayStringIndex === 0,
			})}
		>
			{[...Array(fretCount + 1)].map((_, fretNumber) => (
				<Fret
					key={fretNumber}
					stringIndex={stringIndex}
					fretNumber={fretNumber}
					highlightedNotes={highlightedNotes}
					rootNoteValue={rootNoteValue}
					selectedNotesForPlayback={selectedNotesForPlayback}
					isSelectingMode={isSelectingMode}
					onNoteClick={onNoteClick}
					isToneReady={isToneReady}
					selectedTuning={selectedTuning}
				/>
			))}
		</div>
	);
};

export default React.memo(GuitarString);
