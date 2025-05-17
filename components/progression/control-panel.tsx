// components/ui/chord-progression/control-panel.tsx
import { RootNoteSelector } from "./root-note-selector";
import { PopularProgressionsSelector } from "./popular-progressions-selector";
import { GenerateButton } from "./generate-button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { POPULAR_PROGRESSIONS, RomanNumeral } from "@/lib/music-theory"; // Ensure POPULAR_PROGRESSIONS is imported

interface ControlPanelProps {
	currentRootNote: string;
	onRootNoteChange: (newRoot: string) => void;
	// Updated to pass the name along with the progression
	onPopularProgressionSelect: (progression: RomanNumeral[], name: string) => void;
	onGenerateRandom: () => void;
	isGenerating?: boolean;
	currentPopularProgressionName?: string;
}

export function ControlPanel({
	currentRootNote,
	onRootNoteChange,
	onPopularProgressionSelect, // Changed signature
	onGenerateRandom,
	isGenerating,
	currentPopularProgressionName,
}: ControlPanelProps) {
	// Update the handler within PopularProgressionsSelector or pass it from here
	// For simplicity, assuming PopularProgressionsSelector is modified or we adjust the call
	const handlePopularSelect = (progName: string) => {
		const selected = POPULAR_PROGRESSIONS.find((p) => p.name === progName);
		if (selected) {
			onPopularProgressionSelect(selected.progression, selected.name);
		}
	};
	return (
		<Card className="p-6 shadow-md">
			<CardHeader className="p-0 mb-6">
				<CardTitle className="text-2xl font-semibold">Генерация прогрессий</CardTitle>
				<CardDescription>Выберите тонику и популярную прогрессию или сгенерируйте случайную.</CardDescription>
			</CardHeader>
			<CardContent className="p-0 space-y-6">
				<div className="flex flex-col md:flex-row gap-6 md:gap-4 items-start md:items-end">
					<RootNoteSelector currentRootNote={currentRootNote} onRootNoteChange={onRootNoteChange} />
					<PopularProgressionsSelector
						// The onProgressionSelect in PopularProgressionsSelector needs to expect just the name
						// or we adapt here. Let's modify PopularProgressionsSelector slightly for clarity.
						onProgressionNameSelect={handlePopularSelect} // New prop
						currentProgressionName={currentPopularProgressionName}
					/>
				</div>
				<Separator className="my-6" />
				<div className="flex justify-start">
					<GenerateButton onGenerate={onGenerateRandom} isLoading={isGenerating} />
				</div>
			</CardContent>
		</Card>
	);
}
