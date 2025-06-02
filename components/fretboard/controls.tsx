// components/interactive-fretboard/controls.tsx
import React from "react";
import { GUITAR_TUNINGS_MIDI } from "@/lib/fretboard-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useFretboardStore } from "@/lib/fretboard-store";
import { NOTE_NAMES, SHAPES } from "@/lib/fretboard-utils";
import { cn } from "@/lib/utils";
interface ControlsProps {
	className?: string;
	//availableKeys: string[];
	//availableShapeTypes: string[];
	//availableShapeNames: string[];
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
	const fretCount = useFretboardStore((s) => s.fretCount);
	const setFretCount = useFretboardStore((s) => s.setFretCount);

	const availableKeys = NOTE_NAMES;
	const availableShapeTypes = Object.keys(SHAPES);
	const availableShapeNames = Object.keys(SHAPES[selectedShapeType] || {});

	const keyOptions = availableKeys.map((key) => ({ value: key, label: key }));
	const shapeTypeOptions = availableShapeTypes.map((type) => ({
		value: type,
		label: type.charAt(0).toUpperCase() + type.slice(1),
	}));
	const shapeNameOptions = availableShapeNames.map((name) => ({ value: name, label: name }));
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

	const formula = SHAPES[selectedShapeType][selectedShapeName].map((num) => noteNames[num]);

	return (
		<div className={cn("flex flex-col gap-4", className)}>
			<div className="flex flex-wrap items-center gap-4 p-4 border border-border rounded-md bg-card shadow-sm">
				<div className="flex flex-wrap items-center gap-4">
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
								{Object.keys(GUITAR_TUNINGS_MIDI).map((tuning) => (
									<SelectItem key={tuning} value={tuning}>
										{tuning}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="fret-count-input">Лады</Label>
						<input
							id="fret-count-input"
							type="number"
							min={1}
							max={24}
							value={fretCount}
							onChange={(e) => setFretCount(Number(e.target.value))}
							className="w-[80px] border rounded px-2 py-1"
							placeholder="Лады"
						/>
					</div>
				</div>
			</div>
			<div className="flex flex-wrap justify-center items-center gap-4 w-full">
				<p className="text-center">Формула: {formula.join(", ")}</p>
					<div className="w-8 h-8 flex items-center justify-center outline-none rounded-md bg-red-600 border-2 border-red-700 text-white">
						1
					</div>
					<div className="w-8 h-8 flex items-center justify-center outline-none rounded-md bg-amber-500 border-2 border-amber-700 text-white">
						3
					</div>
					<div className="w-8 h-8 flex items-center justify-center outline-none rounded-md bg-blue-500 border-2 border-blue-700 text-white">
						5
					</div>
					<div className="w-8 h-8 flex items-center justify-center outline-none rounded-md bg-purple-500 border-2 border-purple-700 text-white">
						7
					</div>
			</div>
		</div>
	);
};

export default React.memo(Controls);
