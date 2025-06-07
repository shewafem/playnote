// components/interactive-fretboard/fret.tsx
import React from "react";
import NoteDot from "./note-dot";
import { NoteValue } from "@/lib/fretboard-utils";
import { cn } from "@/lib/utils";

interface FretProps {
	stringIndex: number;
	fretNumber: number;
	highlightedNotes: Set<NoteValue>;
	rootNoteValue: NoteValue;
	selectedNotesForPlayback: Set<string>;
	isSelectingMode: boolean;
	onNoteClick?: (value: string) => void;
	isToneReady: boolean;
	openStringMidiValue: number;
}

const Fret: React.FC<FretProps> = ({
	stringIndex,
	fretNumber,
	highlightedNotes,
	rootNoteValue,
	selectedNotesForPlayback,
	openStringMidiValue,
	isSelectingMode,
	onNoteClick,
	isToneReady,
}) => {

	const midiValue = openStringMidiValue + fretNumber;
	const noteValue = (midiValue % 12) as NoteValue;
	const identifier = `${stringIndex}-${fretNumber}`;

	const isScaleHighlighted = highlightedNotes.has(noteValue);
	const isRoot = isScaleHighlighted && noteValue === rootNoteValue;
	const isFlatSecond = isScaleHighlighted && noteValue === (rootNoteValue + 1) % 12;
	const isSecond = isScaleHighlighted && noteValue === (rootNoteValue + 2) % 12;
	const isFlatThird = isScaleHighlighted && noteValue === (rootNoteValue + 3) % 12;
	const isThird = isScaleHighlighted && noteValue === (rootNoteValue + 4) % 12;
	const isFourth = isScaleHighlighted && noteValue === (rootNoteValue + 5) % 12;
	const isFlatFifth = isScaleHighlighted && noteValue === (rootNoteValue + 6) % 12;
	const isFifth = isScaleHighlighted && noteValue === (rootNoteValue + 7) % 12;
	const isSharpFifth = isScaleHighlighted && noteValue === (rootNoteValue + 8) % 12;
	const isSixth = isScaleHighlighted && noteValue === (rootNoteValue + 9) % 12;
	const isFlatSeventh = isScaleHighlighted && noteValue === (rootNoteValue + 10) % 12;
	const isSeventh = isScaleHighlighted && noteValue === (rootNoteValue + 11) % 12;
	const isSelected = selectedNotesForPlayback.has(identifier);

	return (
		<div
			className={cn(
				"flex border-foreground/80 border-x-3 items-center justify-center h-full",
				// Ширина для "nut" (лад 0)
				fretNumber === 0 ? "w-10 border-0" : "w-18"
			)}
		>
			<NoteDot
				identifier={identifier}
				midiValue={midiValue}
				isHighlighted={isScaleHighlighted}
				isRoot={isRoot}
				isFlatSecond={isFlatSecond}
				isSecond={isSecond}
				isFlatThird={isFlatThird}
				isThird={isThird}
				isFourth={isFourth}
				isFlatFifth={isFlatFifth}
				isFifth={isFifth}
				isSharpFifth={isSharpFifth}
				isSixth={isSixth}
				isFlatSeventh={isFlatSeventh}
				isSeventh={isSeventh}
				isSelected={isSelected}
				isSelectingMode={isSelectingMode}
				onClick={onNoteClick}
				isToneReady={isToneReady}
			/>
		</div>
	);
};

export default React.memo(Fret);
