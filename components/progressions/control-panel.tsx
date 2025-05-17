import { RootNoteSelector } from "./root-note-selector";
import { PopularProgressionsSelector } from "./popular-progressions-selector";
import { GenerateButton } from "./generate-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { POPULAR_PROGRESSIONS, RomanNumeral } from "@/lib/music-theory";

interface ControlPanelProps {
	currentRootNote: string;
	onRootNoteChange: (newRoot: string) => void;
	onPopularProgressionSelect: (progression: RomanNumeral[], name: string) => void;
	onGenerateRandom: () => void;
	isGenerating?: boolean;
	currentPopularProgressionName?: string;
}

export function ControlPanel({
	currentRootNote,
	onRootNoteChange,
	onPopularProgressionSelect,
	onGenerateRandom,
	isGenerating,
	currentPopularProgressionName,
}: ControlPanelProps) {
	const handlePopularSelect = (progName: string) => {
		const selected = POPULAR_PROGRESSIONS.find((p) => p.name === progName);
		if (selected) {
			onPopularProgressionSelect(selected.progression, selected.name);
		}
	};
	return (
		<Card className="p-6 shadow-md gap-2">
			<CardHeader className="p-0 mb-6">
				<CardTitle className="text-2xl font-semibold">Генерация прогрессий</CardTitle>
				<CardDescription>Выберите тонику и популярную прогрессию или сгенерируйте случайную.</CardDescription>
			</CardHeader>
			<CardContent className="p-0 space-y-6">
				<div className="mb-3 flex flex-col md:flex-row gap-2 items-start md:items-end">
					<RootNoteSelector currentRootNote={currentRootNote} onRootNoteChange={onRootNoteChange} />
					  <PopularProgressionsSelector
  						onProgressionNameSelect={handlePopularSelect}
  						currentProgressionName={currentPopularProgressionName}
  					/>
				</div>
				<div className="flex justify-start">
					<GenerateButton onGenerate={onGenerateRandom} isLoading={isGenerating} />
				</div>
			</CardContent>
		</Card>
	);
}
