// components/interactive-fretboard/controls.tsx
import React, { useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useFretboardStore } from "@/lib/fretboard-store";
import { NOTE_NAMES, MAX_FRETS, MIN_DISPLAYED_FRETS_COUNT, MIN_FRETS } from "@/lib/fretboard-utils";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
interface ControlsProps {
	className?: string;
}

const Controls: React.FC<ControlsProps> = ({ className }) => {
	const selectedKey = useFretboardStore((s) => s.selectedKey);
	const setSelectedKey = useFretboardStore((s) => s.setSelectedKey);
	const selectedShapeType = useFretboardStore((s) => s.selectedShapeType);
	const setSelectedShapeType = useFretboardStore((s) => s.setSelectedShapeType);
	const selectedShapeName = useFretboardStore((s) => s.selectedShapeName);
	const setSelectedShapeName = useFretboardStore((s) => s.setSelectedShapeName);
	const selectedTuning = useFretboardStore((s) => s.selectedTuning);
	const setSelectedTuning = useFretboardStore((s) => s.setSelectedTuning);
	const startFret = useFretboardStore((s) => s.startFret);
	const setStartFret = useFretboardStore((s) => s.setStartFret);
	const endFret = useFretboardStore((s) => s.endFret);
	const setEndFret = useFretboardStore((s) => s.setEndFret);
	const allShapes = useFretboardStore((s) => s.allShapes);
	const allTunings = useFretboardStore((s) => s.allTunings);

	const availableKeys = NOTE_NAMES;
	const availableShapeTypes = allShapes ? Object.keys(allShapes) : [];

	const availableShapeNames =
		allShapes && selectedShapeType && allShapes[selectedShapeType] ? Object.keys(allShapes[selectedShapeType]) : [];
    
	const availableTuningNames = allTunings ? Object.keys(allTunings) : [];

	useEffect(() => {
		if (allShapes && selectedShapeType && allShapes[selectedShapeType]) {
			const currentTypeShapes = Object.keys(allShapes[selectedShapeType]);
			if (currentTypeShapes.length > 0 && !currentTypeShapes.includes(selectedShapeName)) {
				setSelectedShapeName(currentTypeShapes[0]);
			} else if (currentTypeShapes.length === 0 && selectedShapeName !== "") {
				setSelectedShapeName("");
			}
		}
	}, [selectedShapeType, selectedShapeName, allShapes, setSelectedShapeName]);

	const keyOptions = availableKeys.map((key) => ({ value: key, label: key }));
	const shapeTypeOptions = availableShapeTypes.map((type) => ({
		value: type,
		label: type.charAt(0).toUpperCase() + type.slice(1),
	}));
	const shapeNameOptions = availableShapeNames.map((name) => ({ value: name, label: name }));
	const tuningOptions = availableTuningNames.map((name) => ({ value: name, label: name }));
	const intervalFullNames: { [key: string]: string } = {
		"1": "Тоника",
		"♭2": "Малая секунда",
		"2": "Большая секунда",
		"♭3": "Малая терция",
		"3": "Большая терция",
		"4": "Чистая кварта",
		"♭5": "Уменьшенная квинта (тритон)",
		"5": "Чистая квинта",
		"♯5": "Увеличенная квинта",
		"6": "Большая секста",
		"♭7": "Малая септима",
		"7": "Большая септима",
		// 12: "Октава",
		// 13: "Малая нона",
		// 14: "Большая нона",
	};
	const noteNames = {
		0: "1",
		1: "♭2",
		2: "2",
		3: "♭3",
		4: "3",
		5: "4",
		6: "♭5",
		7: "5",
		8: "♯5",
		9: "6",
		10: "♭7",
		11: "7",
	};

	const shapeIntervals = allShapes?.[selectedShapeType]?.[selectedShapeName];
	// Ensure formula is always an array, even if the shape is temporarily not found
	const formula = shapeIntervals ? shapeIntervals.map((noteValue) => noteNames[noteValue]) : [];

	if (!allShapes || !allTunings) {
		// Basic loading check
		return <div className={cn("flex flex-col gap-3", className)}>Загружаю панель управления...</div>;
	}

	return (
		<div className={cn("flex flex-col gap-3", className)}>
			<div className="flex flex-wrap items-center justify-center gap-4 p-4 border border-border rounded-md bg-card shadow-sm">
				<div className="flex flex-wrap items-center justify-center gap-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="key-select">Тоника</Label>
						<Select value={selectedKey} onValueChange={setSelectedKey}>
							<SelectTrigger id="key-select" className="w-[120px]">
								<SelectValue placeholder="Выбрать тонику" />
							</SelectTrigger>
							<SelectContent>
								{keyOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="shape-type-select">Тип</Label>
						<Select value={selectedShapeType} onValueChange={setSelectedShapeType}>
							<SelectTrigger id="shape-type-select" className="w-[140px]">
								<SelectValue placeholder="Выбрать тип" />
							</SelectTrigger>
							<SelectContent>
								{shapeTypeOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="shape-name-select">Название</Label>
						<Select value={selectedShapeName} onValueChange={setSelectedShapeName}>
							<SelectTrigger id="shape-name-select" className="w-[180px]">
								<SelectValue placeholder="Выбрать гамму" />
							</SelectTrigger>
							<SelectContent>
								{shapeNameOptions.map((option) => (
									<SelectItem key={option.value} value={option.value}>
										{option.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="tuning-select">Строй</Label>
						<Select value={selectedTuning} onValueChange={setSelectedTuning}>
							<SelectTrigger id="tuning-select" className="w-[120px]">
								<SelectValue placeholder="Выбрать строй" />
							</SelectTrigger>
							<SelectContent>
								{tuningOptions.map((o) => (
									<SelectItem key={o.value} value={o.value}>
										{o.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="start-fret-input">Начальный лад</Label>
						<input
							id="start-fret-input"
							type="number"
							min={MIN_FRETS}
							max={endFret - MIN_DISPLAYED_FRETS_COUNT + 1} // Зависит от endFret
							value={startFret}
							onChange={(e) => {
								setStartFret(Number(e.target.value));
							}}
							className="w-[80px] border rounded px-2 py-1"
							placeholder="Начало"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="end-fret-input">Конечный лад</Label>
						<input
							id="end-fret-input"
							type="number"
							min={startFret + MIN_DISPLAYED_FRETS_COUNT - 1} // Зависит от startFret
							max={MAX_FRETS}
							value={endFret}
							onChange={(e) => {
								setEndFret(Number(e.target.value));
							}}
							className="w-[80px] border rounded px-2 py-1"
							placeholder="Конец"
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-wrap justify-center items-center gap-3 w-full">
				<div className="flex gap-2">
					<p className="text-center font-bold">Формула:</p>{" "}
					{formula.map((degree) => (
						<Tooltip key={degree}>
							<TooltipTrigger>
								<p>{degree}</p>
							</TooltipTrigger>
							<TooltipContent>
								<p>{intervalFullNames[degree]}</p>
							</TooltipContent>
						</Tooltip>
					))}
				</div>
				<div className="flex gap-3 flex-col items-center">
					<p className="text-center text-xs text-muted-foreground">Цветовые обозначения нот:</p>
					<div className="flex gap-2 items-center">
						<Tooltip>
							<TooltipTrigger>
								<div className="w-8 h-8 flex items-center justify-center outline-none rounded-md bg-red-600 border-2 border-red-700 text-white">
									1
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>Тоника</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger>
								<div className="w-8 h-8 flex items-center justify-center outline-none rounded-md bg-amber-500 border-2 border-amber-700 text-white">
									3
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>Большая терция</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger>
								<div className="w-8 h-8 flex items-center justify-center outline-none rounded-md bg-blue-500 border-2 border-blue-700 text-white">
									5
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>Чистая квинта</p>
							</TooltipContent>
						</Tooltip>
						<Tooltip>
							<TooltipTrigger>
								<div className="w-8 h-8 flex items-center justify-center outline-none rounded-md bg-purple-500 border-2 border-purple-700 text-white">
									7
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<p>Большая септима</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</div>
			</div>
		</div>
	);
};

export default React.memo(Controls);
