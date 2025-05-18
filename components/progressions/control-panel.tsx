import { RootNoteSelector } from "./root-note-selector";
import { PopularProgressionsSelector } from "./popular-progressions-selector";
import { GenerateButton } from "./generate-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { POPULAR_PROGRESSIONS, RomanNumeral } from "@/lib/music-theory";
import { cn } from "@/lib/utils";

interface ControlPanelProps {
	currentRootNote: string;
	onRootNoteChange: (newRoot: string) => void;
	onPopularProgressionSelect: (progression: RomanNumeral[], name: string) => void;
	onGenerateRandom: () => void;
	isGenerating?: boolean;
	currentPopularProgressionName?: string;
	className?: string;
}

export function ControlPanel({
	currentRootNote,
	onRootNoteChange,
	onPopularProgressionSelect,
	onGenerateRandom,
	isGenerating,
	currentPopularProgressionName,
	className,
}: ControlPanelProps) {
	const handlePopularSelect = (progName: string) => {
		const selected = POPULAR_PROGRESSIONS.find((p) => p.name === progName);
		if (selected) {
			onPopularProgressionSelect(selected.progression, selected.name);
		}
	};
	return (
		<Card className={cn(className, "p-8 w-full pt-6 shadow-md gap-6 xs:w-140")}>
			<CardHeader className="p-0 ">
				<CardTitle className="text-2xl font-bold text-center tracking-tight mb-2">Генерация прогрессий</CardTitle>
				<CardDescription>
					Выберите тонику и популярную прогрессию или сгенерируйте случайную.
				</CardDescription>
			</CardHeader>
			<CardContent className="p-0 space-y-6">
				<div className="flex flex-row gap-2">
					<RootNoteSelector currentRootNote={currentRootNote} onRootNoteChange={onRootNoteChange} />
					<PopularProgressionsSelector
						onProgressionNameSelect={handlePopularSelect}
						currentProgressionName={currentPopularProgressionName}
					/>
					<div className="mt-auto grow-1">
						<GenerateButton onGenerate={onGenerateRandom} isLoading={isGenerating} />
					</div>
				</div>
				{/*<div className="flex justify-start">
					<GenerateButton onGenerate={onGenerateRandom} isLoading={isGenerating} />
				</div>*/}
			</CardContent>
		</Card>
	);
}
