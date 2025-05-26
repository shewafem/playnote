import { ScaleChord } from "@/lib/progression-utils";
import { ChordCard } from "@/components/progressions/chord-card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
interface InteractiveChordCardProps {
	chord: ScaleChord;
	onClick: (chord: ScaleChord) => void;
	disabled?: boolean;
}

export function InteractiveChordCard({ chord, onClick, disabled }: InteractiveChordCardProps) {
	return (
		<TooltipProvider delayDuration={100}>
			<Tooltip>
				<TooltipTrigger>
					<ChordCard
						chord={chord}
						className={`${
							disabled
								? "opacity-50 cursor-not-allowed bg-muted/50"
								: "hover:shadow-xl hover:ring-2 hover:ring-primary hover:scale-105 cursor-pointer"
						} ring-1 ring-slate-200 dark:ring-slate-700 group`}
						onClick={() => !disabled && onClick(chord)}
						aria-label={`Добавьте ${chord.displayName} в прогрессию`}
					/>
				</TooltipTrigger>
				<TooltipContent>{`Добавить ${chord.displayName}`}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
