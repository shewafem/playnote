// components/interactive-fretboard/fret-numbers.tsx
import React from "react";
import { cn } from "@/lib/utils";
import { useFretboardStore } from "@/lib/fretboard-store";

const markerFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

const FretNumbers: React.FC = () => {
	const startFret = useFretboardStore((s) => s.startFret);
	const endFret = useFretboardStore((s) => s.endFret);

	const fretsToDisplay = [];
	const firstNumberedFret = startFret === 0 ? 1 : startFret;

	for (let i = firstNumberedFret; i <= endFret; i++) {
		if (i > 0) {
			fretsToDisplay.push(i);
		}
	}

	return (
		<div className="flex flex-col">
			<div className="flex mb-1 select-none">
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
