// components/interactive-fretboard/fretboard-display.tsx
import React from "react";
import GuitarString from "./guitar-string";
import FretNumbers from "./fret-numbers";
import { GUITAR_TUNINGS_MIDI } from "@/lib/fretboard-utils";
import { NoteValue } from "@/lib/fretboard-utils";
import { cn } from "@/lib/utils";
import { useFretboardStore } from "@/lib/fretboard-store";
interface FretboardDisplayProps {
	highlightedNotes: Set<NoteValue>;
	rootNoteValue: NoteValue;
	onNoteClick?: (value: string) => void;
	fretCount: number;
}

const FretboardDisplay: React.FC<FretboardDisplayProps> = ({
	highlightedNotes,
	rootNoteValue,
	onNoteClick,
	fretCount,
}) => {
	const isSelectingNotes = useFretboardStore((s) => s.isSelectingNotes);
	const currentlySelectingNotes = useFretboardStore((s) => s.currentlySelectingNotes);
	const selectedNotesForPlayback = useFretboardStore((s) => s.selectedNotesForPlayback);
	const selectedTuning = useFretboardStore((s) => s.selectedTuning);
	const isToneReady = useFretboardStore((s) => s.isToneReady);
	const selectedNotes = isSelectingNotes ? currentlySelectingNotes : selectedNotesForPlayback;
	const selectedNotesSet = React.useMemo(() => new Set(selectedNotes || []), [selectedNotes]);

	const tuning = GUITAR_TUNINGS_MIDI[selectedTuning];

	return (
		<div className={cn("flex flex-col p-4 bg-card border rotate-90 sm:rotate-0 my-90 sm:my-0 border-border rounded-md shadow-lg", "sm:max-w-[95vw] w-fit")}>
			<FretNumbers fretCount={fretCount} />
			{tuning.map((_, stringIndex) => (
				<GuitarString
					key={stringIndex}
					stringIndex={stringIndex}
					highlightedNotes={highlightedNotes}
					rootNoteValue={rootNoteValue}
					selectedNotesForPlayback={selectedNotesSet}
					isSelectingMode={isSelectingNotes}
					onNoteClick={isToneReady ? onNoteClick : undefined}
					isToneReady={isToneReady}
					selectedTuning={selectedTuning}
					fretCount={fretCount}
				/>
			))}
			{/* Marker */}
			<div className="flex h-6 items-center select-none mt-1">
				<div className="w-10"></div>
				{[...Array(fretCount)].map((_, fretIndex) => {
					const fret = fretIndex + 1;
					if (fret === 12 || fret === 24) {
						return (
							<div key={`fret-dot-${fretIndex}`} className="w-18 flex flex-col items-center justify-center">
								<div className="h-1"></div>
								<div className="flex gap-1 items-center">
									<span className="w-3 h-3 rounded-full bg-black/70 dark:bg-white/70 block"></span>
									<span className="w-3 h-3 rounded-full bg-black/70 dark:bg-white/70 block"></span>
								</div>
							</div>
						);
					}
					if ([3, 5, 7, 9, 15, 17, 19, 21].includes(fret)) {
						return (
							<div key={`fret-dot-${fretIndex}`} className="w-18 flex items-center justify-center">
								<span className="w-4 h-4 rounded-full dark:bg-white/70 bg-black/70 block"></span>
							</div>
						);
					}
					return <div key={`fret-dot-${fretIndex}`} className="w-18"></div>;
				})}
			</div>
		</div>
	);
};

export default React.memo(FretboardDisplay);
