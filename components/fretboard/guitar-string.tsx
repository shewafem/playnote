// components/interactive-fretboard/guitar-string.tsx
import React from "react";
import Fret from "./fret";
// GUITAR_TUNING_DEFAULT не нужен здесь, если selectedTuning передается
import { NoteValue } from "@/lib/fretboard-utils";
import { cn } from "@/lib/utils";
// import { useFretboardStore } from "@/lib/fretboard-store"; // Не нужен здесь, если startFret и fretCount передаются как props

interface GuitarStringProps {
    stringIndex: number;
    highlightedNotes: Set<NoteValue>;
    rootNoteValue: NoteValue;
    selectedNotesForPlayback: Set<string>; // Идентификаторы абсолютные "string-absFret"
    isSelectingMode: boolean;
    onNoteClick?: (value: string) => void;
    isToneReady: boolean;
    selectedTuning: string;
    // fretCount: number; // Количество отображаемых
    // startFret: number; // Начальный абсолютный лад
    // Вместо передачи пропсами, возьмем из FretboardDisplay или напрямую из стора, если удобнее
}

const GuitarString: React.FC<GuitarStringProps & { fretCountToDisplay: number; firstFretToDisplay: number } > = ({
    stringIndex,
    highlightedNotes,
    rootNoteValue,
    selectedNotesForPlayback,
    isSelectingMode,
    onNoteClick,
    isToneReady,
    selectedTuning,
    fretCountToDisplay, // Количество ладов для отображения
    firstFretToDisplay, // Абсолютный номер первого отображаемого лада
}) => {
    // const displayStringIndex = GUITAR_TUNING_DEFAULT.length - 1 - stringIndex; // Зависит от GUITAR_TUNING_DEFAULT, лучше передать количество струн или вычислить из selectedTuning

    return (
        <div
            className={cn("flex items-center h-10", "border-b-2 border-gray-500", {
                // "last:border-b-0": displayStringIndex === 0, // Логика последнего элемента может измениться, если порядок струн меняется
            })}
        >
            {/* Рендерим "nut" если firstFretToDisplay === 0 */}
            {firstFretToDisplay === 0 && (
                <Fret
                    key={`${stringIndex}-0`} // Абсолютный ключ
                    stringIndex={stringIndex}
                    fretNumber={0} // Абсолютный номер лада (открытая струна)
                    highlightedNotes={highlightedNotes}
                    rootNoteValue={rootNoteValue}
                    selectedNotesForPlayback={selectedNotesForPlayback}
                    isSelectingMode={isSelectingMode}
                    onNoteClick={onNoteClick}
                    isToneReady={isToneReady}
                    selectedTuning={selectedTuning}
                />
            )}
            {/* Рендерим остальные видимые лады */}
            {[...Array(fretCountToDisplay)].map((_, index) => {
                // Абсолютный номер текущего лада
                // Если firstFretToDisplay = 0, то первый видимый лад (после nut) это 1 (index=0 -> 0+1=1)
                // Если firstFretToDisplay = 5, то первый видимый лад это 5 (index=0 -> 5+0=5)
                const absoluteFretNumber = firstFretToDisplay + index + (firstFretToDisplay === 0 ? 1 : 0);
                
                // Не рендерим "nut" здесь снова, если он уже был отрендерен выше
                if (firstFretToDisplay === 0 && absoluteFretNumber === 0) return null;


                return (
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
                );
            })}
        </div>
    );
};

export default React.memo(GuitarString);