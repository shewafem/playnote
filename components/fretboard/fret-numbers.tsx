// components/interactive-fretboard/fret-numbers.tsx
import React from "react";
import { cn } from "@/lib/utils";

interface FretNumbersProps {
	fretCount: number;
}

const markerFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];

const FretNumbers: React.FC<FretNumbersProps> = ({ fretCount }) => {
	return (
		<div className="flex flex-col">
			{/* Fret numbers row */}
			<div className="flex mb-1 select-none">
				<div className="w-10"></div>
				{[...Array(fretCount)].map((_, fretIndex) => (
					<div
						key={`fret-num-${fretIndex}`}
						className={cn(
							"w-18 text-sm sm:text-lg text-center text-muted-foreground",
							markerFrets.includes(fretIndex + 1) ? "font-black text-sm sm:text-lg text-primary drop-shadow" : ""
						)}
					>
						{fretIndex + 1}
					</div>
				))}
			</div>
		</div>
	);
};

export default React.memo(FretNumbers);
