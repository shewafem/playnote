// components/interactive-fretboard/fretboard-display.tsx
import React from "react";
import GuitarString from "./guitar-string";
import FretNumbers from "./fret-numbers";
import { GUITAR_TUNING_DEFAULT } from "@/lib/music-utils";
import { NoteValue } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FretboardDisplayProps {
	highlightedNotes: Set<NoteValue>;
	rootNoteValue: NoteValue | undefined;
	onNoteClick?: (value: string) => void;
	selectedNotesForPlayback: string[]; //идентификаторы ("s-f")
	currentlyPlayingNoteId: string | null;
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
	isToneReady,
}) => {
	//const numStrings = GUITAR_TUNING_DEFAULT.length;

	const selectedNotesSet = React.useMemo(() => new Set(selectedNotesForPlayback || []), [selectedNotesForPlayback]);

	return (
		<div
			className={cn(
				"flex flex-col p-4 bg-card border border-border rounded-md relative overflow-x-auto shadow-lg",
				"w-fit"
			)}
		>
			<FretNumbers />
			{GUITAR_TUNING_DEFAULT.map((_, stringIndex) => (
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
				/>
			))}
		</div>
	);
};

export default FretboardDisplay;
