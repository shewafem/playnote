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
import { POPULAR_PROGRESSIONS } from "@/lib/progression";

interface PopularProgressionsSelectorProps {
	onProgressionNameSelect: (name: string) => void;
	currentProgressionName?: string;
}

export function PopularProgressionsSelector({
	onProgressionNameSelect,
	currentProgressionName,
}: PopularProgressionsSelectorProps) {
	const handleSelect = (name: string) => {
		onProgressionNameSelect(name);
	};

	return (
		<div className="flex flex-col space-y-1.5 overflow-hidden">
			<Label htmlFor="popular-progression" className="text-sm font-medium">
				Популярные
			</Label>
			<Select onValueChange={handleSelect} value={currentProgressionName}>
				<SelectTrigger id="popular-progression" className="w-full">
					<SelectValue placeholder="Выберите прогрессию" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectLabel>Популярные прогрессии</SelectLabel>
						{POPULAR_PROGRESSIONS.map((prog) => (
							<SelectItem key={prog.name} value={prog.name}>
								{prog.name} {`(${prog.progression.join("-")})`}
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
}
