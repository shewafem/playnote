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
	selectedNotesForPlayback: Set<string>; // Идентификаторы абсолютные "string-absFret"
	isSelectingMode: boolean;
	onNoteClick?: (value: string) => void;
	isToneReady: boolean;
	selectedTuning: string;
	// Вместо передачи пропсами, возьмем из FretboardDisplay или напрямую из стора, если удобнее
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
}) => {
  const startFret = useFretboardStore((s) => s.startFret);
  const endFret = useFretboardStore((s) => s.endFret)

	const fretsOnString = [];
	// Если startFret === 0, включаем "nut" (лад 0)
	if (startFret === 0) {
		fretsOnString.push(0);
	}
	// Добавляем остальные лады от (startFret === 0 ? 1 : startFret) до endFret
	const firstPhysicalFret = startFret === 0 ? 1 : startFret;
	for (let i = firstPhysicalFret; i <= endFret; i++) {
		if (i > 0) {
			// Убедимся, что не дублируем лад 0, если startFret=0
			fretsOnString.push(i);
		}
	}
	// Если startFret = 0, но firstPhysicalFret = 1, а endFret = 0 (невалидное состояние из стора)
	// fretsOnString может быть [0] или пустым.

	// Более простой способ получить массив абсолютных ладов для рендера:
	const absoluteFretsToRender = [];
	for (let absFret = startFret; absFret <= endFret; absFret++) {
		absoluteFretsToRender.push(absFret);
	}

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
					selectedTuning={selectedTuning}
				/>
			))}
		</div>
	);
};

export default React.memo(GuitarString);
