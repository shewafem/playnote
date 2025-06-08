// components/interactive-fretboard/fretboard-display.tsx
import React, { useMemo, useRef } from "react";
import GuitarString from "./guitar-string";
import FretNumbers from "./fret-numbers";
import { getNoteName } from "@/lib/fretboard-utils";
import { NoteValue } from "@/lib/fretboard-utils";
import { cn } from "@/lib/utils";
import { useFretboardStore } from "@/lib/fretboard-store";
import { Button } from "../ui/button";
import html2canvas from "html2canvas-pro";
import { Download, Save } from "lucide-react";

interface FretboardDisplayProps {
	highlightedNotes: Set<NoteValue>;
	rootNoteValue: NoteValue;
	onNoteClick?: (value: string) => void;
	// fretCount и startFret теперь из стора
}

const FretboardDisplay: React.FC<FretboardDisplayProps> = ({ highlightedNotes, rootNoteValue, onNoteClick }) => {
	const isSelectingNotes = useFretboardStore((s) => s.isSelectingNotes);
	const currentlySelectingNotes = useFretboardStore((s) => s.currentlySelectingNotes);
	const selectedNotesForPlayback = useFretboardStore((s) => s.selectedNotesForPlayback);
	const selectedTuning = useFretboardStore((s) => s.selectedTuning);
	const isToneReady = useFretboardStore((s) => s.isToneReady);
	const startFret = useFretboardStore((s) => s.startFret);
	const endFret = useFretboardStore((s) => s.endFret);
	const selectedShapeName = useFretboardStore((s) => s.selectedShapeName);
	const allTunings = useFretboardStore((s) => s.allTunings);

	const selectedNotes = isSelectingNotes ? currentlySelectingNotes : selectedNotesForPlayback;
	const selectedNotesSet = React.useMemo(() => new Set(selectedNotes || []), [selectedNotes]);

	const rootNote = getNoteName(rootNoteValue);
	const fretboardDisplayRef = useRef<HTMLDivElement>(null);

	const currentTuningMidi = useMemo(() => {
		return allTunings && selectedTuning && allTunings[selectedTuning] ? allTunings[selectedTuning] : null;
	}, [allTunings, selectedTuning]);

	const selectedKey = useFretboardStore((s) => s.selectedKey);
	const selectedShapeType = useFretboardStore((s) => s.selectedShapeType);

	const handleSaveConfiguration = async () => {
		const configurationToSave = `?key=${selectedKey}&type=${selectedShapeType}&name=${selectedShapeName}&tuning=${selectedTuning}&startFret=${startFret}&endFret=${endFret}`;
		console.log("Сохраняемая конфигурация:", configurationToSave);
	};

	const downloadFretboardImage = async () => {
		const element = fretboardDisplayRef.current;
		if (!element) {
			console.warn("Элемент не найден");
			return;
		}

		try {
			const canvas = await html2canvas(element, {
				width: element.clientWidth,
				backgroundColor: null,
			});

			const dataURL = canvas.toDataURL("image/png");

			const link = document.createElement("a");
			link.href = dataURL;
			link.download = `Гриф-${rootNote}-${selectedShapeName}-${selectedTuning}.png`;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Ошибка генерации изображения:", error);
		}
	};

	const fretsForMarkers = [];
	const firstNumberedFretForMarker = startFret === 0 ? 1 : startFret;
	for (let i = firstNumberedFretForMarker; i <= endFret; i++) {
		if (i > 0) fretsForMarkers.push(i);
	}

	if (!currentTuningMidi) {
		return <div>Загрузка тюнинга...</div>;
	}
	return (
		<>
			<p className="text-center text-xs text-muted-foreground">Наведите на ноты для подробной информации</p>
			<div
				ref={fretboardDisplayRef}
				className={cn(
					"flex flex-col flex-wrap p-1 sm:p-2.5 bg-card border sm:max-w-[90vw] max-w-[90vh] rotate-90 sm:rotate-0 my-50 sm:my-0 border-border rounded-md shadow-lg overflow-auto"
				)}
			>
				<FretNumbers />
				{currentTuningMidi.map((_, stringIndex) => (
					<GuitarString
						key={stringIndex}
						stringIndex={stringIndex}
						highlightedNotes={highlightedNotes}
						rootNoteValue={rootNoteValue}
						selectedNotesForPlayback={selectedNotesSet}
						isSelectingMode={isSelectingNotes}
						onNoteClick={isToneReady ? onNoteClick : undefined}
						isToneReady={isToneReady}
						tuningMidiValues={currentTuningMidi} // Pass the full MIDI array for the current tuning
					/>
				))}
				{/* Маркеры под грифом */}
				<div className="flex h-2 sm:h-5 items-center select-none mt-1">
					<div className={cn(startFret === 0 ? "w-10" : "w-0")}></div>
					{fretsForMarkers.map((absoluteFretNumber) => {
						// Логика для маркеров (двойные на 12, 24; одинарные на 3,5,7,9 и т.д.)
						if (absoluteFretNumber === 12 || absoluteFretNumber === 24) {
							return (
								<div key={`fret-dot-${absoluteFretNumber}`} className="w-18 flex flex-col items-center justify-center">
									<div className="h-1"></div>
									<div className="flex gap-1 items-center">
										<span className="w-2 h-2 xs:w-3 xs:h-3 rounded-full bg-black/70 dark:bg-white/70 block"></span>
										<span className="w-2 h-2 xs:w-3 xs:h-3 rounded-full bg-black/70 dark:bg-white/70 block"></span>
									</div>
								</div>
							);
						}
						if ([3, 5, 7, 9, 15, 17, 19, 21].includes(absoluteFretNumber)) {
							return (
								<div key={`fret-dot-${absoluteFretNumber}`} className="w-18 flex items-center justify-center">
									<span className="w-2 h-2 xs:w-3 xs:h-3 rounded-full dark:bg-white/70 bg-black/70 block"></span>
								</div>
							);
						}
						return <div key={`fret-dot-${absoluteFretNumber}`} className="w-18"></div>;
					})}
				</div>
			</div>
			<Button className="cursor-pointer" onClick={downloadFretboardImage}>
				Скачать текущий гриф как PNG <Download />
			</Button>
			<Button className="cursor-pointer" onClick={handleSaveConfiguration}>
				Сохранить конфигурацию <Save />
			</Button>
		</>
	);
};

export default React.memo(FretboardDisplay);
