import { ScaleChord } from "@/lib/progression-utils";
import { InteractiveChordCard } from "./interactive-chord-card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MousePointerClick } from "lucide-react";

interface InteractiveChordBuilderProps {
	diatonicChords: ScaleChord[];
	onChordSelect: (chord: ScaleChord) => void;
	currentKey: string;
	maxCustomProgressionLength?: number;
	currentCustomProgressionLength?: number;
}

export function InteractiveChordBuilder({
	diatonicChords,
	onChordSelect,
	currentKey,
	maxCustomProgressionLength = 8,
	currentCustomProgressionLength = 0,
}: InteractiveChordBuilderProps) {
	const isBuilderDisabled = currentCustomProgressionLength >= maxCustomProgressionLength;

	if (!diatonicChords.length) {
		return <p className="text-muted-foreground text-center">Выберите тонику, чтобы увидеть аккорды</p>;
	}

	return (
		<div className="flex flex-col justify-center items-center gap-5">
			<Alert className="border-primary/50 w-fit">
				<MousePointerClick className="h-4 w-4" />
				<AlertTitle className="font-semibold">Постройте свои прогрессии в {currentKey} Major.</AlertTitle>
				<AlertDescription>
					Кликните по аккордам ниже, чтобы добавить в свою прогрессию.
					{isBuilderDisabled && (
						<span className="text-destructive font-medium block mt-1">
							Максимальная длина прогрессии {maxCustomProgressionLength} достигнута.
						</span>
					)}
				</AlertDescription>
			</Alert>
			<div className="flex flex-wrap gap-4 justify-center">
				{diatonicChords.map((chord) => (
					<InteractiveChordCard
						key={chord.numeral + chord.rootNote}
						chord={chord}
						onClick={onChordSelect}
						disabled={isBuilderDisabled}
					/>
				))}
			</div>
		</div>
	);
}
