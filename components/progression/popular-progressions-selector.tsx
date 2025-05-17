// components/ui/chord-progression/popular-progressions-selector.tsx
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	SelectGroup,
	SelectLabel,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { POPULAR_PROGRESSIONS} from "@/lib/music-theory";

interface PopularProgressionsSelectorProps {
	onProgressionNameSelect: (name: string) => void; // Changed prop
	currentProgressionName?: string;
}

export function PopularProgressionsSelector({
	onProgressionNameSelect,
	currentProgressionName,
}: PopularProgressionsSelectorProps) {
	// handleSelect now just passes the name
	const handleSelect = (name: string) => {
		onProgressionNameSelect(name);
	};

	return (
		<div className="flex flex-col space-y-1.5">
			<Label htmlFor="popular-progression" className="text-sm font-medium">
				Популярные прогрессии
			</Label>
			<Select onValueChange={handleSelect} value={currentProgressionName}>
				<SelectTrigger id="popular-progression" className="w-[280px]">
					<SelectValue placeholder="Select a Popular Progression" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Частые прогрессии</SelectLabel>
						{POPULAR_PROGRESSIONS.map((prog) => (
							<SelectItem key={prog.name} value={prog.name}>
								{prog.name} ({prog.progression.join(" - ")})
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
