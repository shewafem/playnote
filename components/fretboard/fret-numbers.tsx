// components/interactive-fretboard/fret-numbers.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { useFretboardStore } from "@/lib/fretboard-store";

const markerFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

const FretNumbers: React.FC = () => {
    const fretCountToDisplay = useFretboardStore((s) => s.fretCount);
    const firstFretToDisplay = useFretboardStore((s) => s.startFret);

    return (
        <div className="flex flex-col">
            <div className="flex mb-1 select-none">
                {/* Отступ слева для нут/открытых струн, если firstFretToDisplay === 0 */}
                <div className={cn(firstFretToDisplay === 0 ? "w-10" : "w-0")}></div>
                
                {/* Генерируем номера для отображаемых ладов */}
                {[...Array(fretCountToDisplay)].map((_, index) => {
                    // Абсолютный номер лада, который мы отображаем на этой позиции
                    // Если firstFretToDisplay = 0, то первый лад (index=0) это 1, второй (index=1) это 2 ...
                    // Если firstFretToDisplay = 5, то первый лад (index=0) это 5, второй (index=1) это 6 ...
                    const absoluteFretNumber = firstFretToDisplay + index + (firstFretToDisplay === 0 ? 1 : 0);
                    
                    return (
                        <div
                            key={`fret-num-${absoluteFretNumber}`} // Ключ по абсолютному номеру
                            className={cn(
                                "w-18 text-sm sm:text-lg text-center text-muted-foreground",
                                markerFrets.includes(absoluteFretNumber) ? "font-black text-sm sm:text-lg text-primary drop-shadow" : ""
                            )}
                        >
                            {absoluteFretNumber}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default React.memo(FretNumbers);