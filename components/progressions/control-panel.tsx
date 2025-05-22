import { RootNoteSelector } from "./root-note-selector";
import { PopularProgressionsSelector } from "./popular-progressions-selector";
import { GenerateButton } from "./generate-button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { POPULAR_PROGRESSIONS, RomanNumeral } from "@/lib/progression";
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
		<Card className={cn(className, "p-8 w-full pt-6 shadow-md gap-3 xs:max-w-150")}>
			<CardHeader className="p-0 gap-6">
				<CardTitle className="text-2xl font-bold text-center tracking-tight">Генерация прогрессий</CardTitle>
				<CardDescription className="">Выберите тонику и прогрессию или сгенерируйте случайную.</CardDescription>
			</CardHeader>
			<CardContent className="p-0 space-y-6">
				<div className="flex gap-2 flex-col xs:flex-row">
					<RootNoteSelector currentRootNote={currentRootNote} onRootNoteChange={onRootNoteChange} />
					<PopularProgressionsSelector
						onProgressionNameSelect={handlePopularSelect}
						currentProgressionName={currentPopularProgressionName}
					/>
					<div className="xs:mt-auto grow-1 mt-4">
						<GenerateButton onGenerate={onGenerateRandom} isLoading={isGenerating} />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
