// components/interactive-fretboard/fret-numbers.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { useFretboardStore } from "@/lib/fretboard-store";



const markerFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24]; // Абсолютные маркеры

const FretNumbers: React.FC = () => {
	const startFret = useFretboardStore((s) => s.startFret);
	const endFret = useFretboardStore((s) => s.endFret);

	// Количество ладов для отображения (включая начальный и конечный)
	// Если startFret=0, endFret=12, то отображаем лады 0,1,2...12 (13 позиций, но лад "0" - это nut)
	// Фактически номера ладов будут от 1 до endFret, если startFret=0.
	// Если startFret > 0, то номера от startFret до endFret.

	const fretsToDisplay = [];
	// Если startFret равен 0, он представляет открытые струны (nut).
	// Номера ладов начинаются с 1.
	// Мы отображаем лады от (startFret === 0 ? 1 : startFret) до endFret.
	const firstNumberedFret = startFret === 0 ? 1 : startFret;

	for (let i = firstNumberedFret; i <= endFret; i++) {
		if (i > 0) {
			fretsToDisplay.push(i);
		}
	}

	return (
		<div className="flex flex-col">
			<div className="flex mb-1 select-none">
				{/* Отступ слева для nut/открытых струн, если startFret === 0 */}
				<div className={cn(startFret === 0 ? "w-10" : "w-0")}></div>

				{fretsToDisplay.map((fretNumber) => (
					<div
						key={`fret-num-${fretNumber}`}
						className={cn(
							"w-18 text-sm sm:text-lg text-center text-muted-foreground",
							markerFrets.includes(fretNumber) ? "font-black text-sm sm:text-lg text-primary drop-shadow" : ""
						)}
					>
						{fretNumber}
					</div>
				))}
			</div>
		</div>
	);
};

export default React.memo(FretNumbers);
