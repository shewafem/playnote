import { ScaleChord } from "@/lib/progression";
import { ChordCard } from "./chord-card";

interface ProgressionDisplayProps {
	progressionChords: (ScaleChord | undefined)[];
	ref: React.RefObject<HTMLDivElement | null>;
}

export function ProgressionDisplay({ progressionChords, ref }: ProgressionDisplayProps) {
	if (!progressionChords || progressionChords.length === 0) {
		return (
			<div
				ref={ref}
				className="h-36 w-full flex p-4 mt-4 justify-center items-center border-2 border-dashed rounded-lg bg-muted/50"
			>
				<p className="text-muted-foreground text-center">Выберите или сгенерируйте прогрессию</p>
			</div>
		);
	}

	return (
		<div ref={ref} className="flex flex-wrap gap-4 p-2 justify-center items-center">
			{progressionChords.map((chord, index) =>
				chord ? (
					<ChordCard key={`${chord.numeral}-${chord.rootNote}-${index}`} chord={chord} />
				) : (
					<div
						key={`undefined-${index}`}
						className="w-32 h-40 flex items-center justify-center border border-dashed rounded-md bg-muted/30"
					>
						<p className="text-sm text-destructive">?</p>
					</div>
				)
			)}
		</div>
	);
}
