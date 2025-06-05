// components/interactive-fretboard/fretboard-display.tsx
import React, { useRef } from "react";
import GuitarString from "./guitar-string";
import FretNumbers from "./fret-numbers";
import { getNoteName, GUITAR_TUNINGS_MIDI } from "@/lib/fretboard-utils";
import { NoteValue } from "@/lib/fretboard-utils";
import { cn } from "@/lib/utils";
import { useFretboardStore } from "@/lib/fretboard-store";
import { Button } from "../ui/button";
import html2canvas from "html2canvas-pro";
import { Download } from "lucide-react";
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
	const selectedShapeName = useFretboardStore((s) => s.selectedShapeName);

  const rootNote = getNoteName(rootNoteValue);

  const fretboardDisplayRef = useRef<HTMLDivElement>(null);

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
      link.download = `Гриф-${rootNote}-${selectedShapeName}-${selectedTuning}.png`
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Ошибка генерации изображения:", error);
    }
  };
	const tuning = GUITAR_TUNINGS_MIDI[selectedTuning];

	return (
		<>		<p className="text-center text-xs text-muted-foreground">Наведите на ноты для подробной информации</p>
			<div
				ref={fretboardDisplayRef}
				className={cn(
					"flex flex-col flex-wrap p-1 sm:p-2.5 bg-card border sm:max-w-[90vw] max-w-[90vh] rotate-90 sm:rotate-0 my-50 sm:my-0 border-border rounded-md shadow-lg overflow-auto"
				)}
			>
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
				<div className="flex h-2 sm:h-5 items-center select-none mt-1">
					<div className="w-10"></div>
					{[...Array(fretCount)].map((_, fretIndex) => {
						const fret = fretIndex + 1;
						if (fret === 12 || fret === 24) {
							return (
								<div key={`fret-dot-${fretIndex}`} className="w-18 flex flex-col items-center justify-center">
									<div className="h-1"></div>
									<div className="flex gap-1 items-center">
										<span className="w-2 h-2 xs:w-3 xs:h-3 rounded-full bg-black/70 dark:bg-white/70 block"></span>
										<span className="w-2 h-2 xs:w-3 xs:h-3 rounded-full bg-black/70 dark:bg-white/70 block"></span>
									</div>
								</div>
							);
						}
						if ([3, 5, 7, 9, 15, 17, 19, 21].includes(fret)) {
							return (
								<div key={`fret-dot-${fretIndex}`} className="w-18 flex items-center justify-center">
									<span className="w-2 h-2 xs:w-3 xs:h-3 rounded-full dark:bg-white/70 bg-black/70 block"></span>
								</div>
							);
						}
						return <div key={`fret-dot-${fretIndex}`} className="w-18"></div>;
					})}
				</div>
			</div>
			<Button className="cursor-pointer" onClick={downloadFretboardImage}>Скачать текущий гриф <Download /></Button>
		</>
	);
};

export default React.memo(FretboardDisplay);
