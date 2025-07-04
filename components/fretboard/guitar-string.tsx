// components/interactive-fretboard/guitar-string.tsx
import React from "react";
import Fret from "./fret";
// GUITAR_TUNING_DEFAULT не нужен здесь, если selectedTuning передается
import { NoteValue } from "@/lib/fretboard-utils";
import { cn } from "@/lib/utils";
import { useFretboardStore } from "@/lib/fretboard-store";

interface GuitarStringProps {
	stringIndex: number;
	highlightedNotes: Set<NoteValue>;
	rootNoteValue: NoteValue;
	selectedNotesForPlayback: Set<string>;
	isSelectingMode: boolean;
	onNoteClick?: (value: string) => void;
	isToneReady: boolean;
	tuningMidiValues: number[];
}

const GuitarString: React.FC<GuitarStringProps> = ({
	stringIndex,
	highlightedNotes,
	rootNoteValue,
	selectedNotesForPlayback,
	isSelectingMode,
	onNoteClick,
	isToneReady,
	tuningMidiValues,
}) => {
  const startFret = useFretboardStore((s) => s.startFret);
  const endFret = useFretboardStore((s) => s.endFret)

	const fretsOnString = [];
	if (startFret === 0) {
		fretsOnString.push(0);
	}
	const firstPhysicalFret = startFret === 0 ? 1 : startFret;
	for (let i = firstPhysicalFret; i <= endFret; i++) {
		if (i > 0) {
			fretsOnString.push(i);
		}
	}
  
	const absoluteFretsToRender = [];
	for (let absFret = startFret; absFret <= endFret; absFret++) {
		absoluteFretsToRender.push(absFret);
	}

  const openStringMidiValue = tuningMidiValues[stringIndex];

	return (
		<div className={cn("flex items-center h-10", "border-b-2 border-gray-500")}>
			{absoluteFretsToRender.map((absoluteFretNumber) => (
				<Fret
					key={`${stringIndex}-${absoluteFretNumber}`}
					stringIndex={stringIndex}
					fretNumber={absoluteFretNumber}
					highlightedNotes={highlightedNotes}
					rootNoteValue={rootNoteValue}
					selectedNotesForPlayback={selectedNotesForPlayback}
					isSelectingMode={isSelectingMode}
					onNoteClick={onNoteClick}
					isToneReady={isToneReady}
					openStringMidiValue={openStringMidiValue}
				/>
			))}
		</div>
	);
};

export default React.memo(GuitarString);
