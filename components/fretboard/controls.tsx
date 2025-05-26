// components/interactive-fretboard/controls.tsx
import React from "react";
import { GUITAR_TUNINGS_MIDI } from "@/lib/fretboard-utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ControlsProps {
	selectedKey: string;
	setSelectedKey: (key: string) => void;
	selectedShapeType: string;
	setSelectedShapeType: (type: string) => void;
	selectedShapeName: string;
	setSelectedShapeName: (name: string) => void;
	selectedTuning: string;
	setSelectedTuning: (tuning: string) => void;
	availableKeys: string[];
	availableShapeTypes: string[];
	availableShapeNames: string[];
}

const Controls: React.FC<ControlsProps> = ({
	selectedKey,
	setSelectedKey,
	selectedShapeType,
	setSelectedShapeType,
	selectedShapeName,
	setSelectedShapeName,
	selectedTuning,
	setSelectedTuning,
	availableKeys,
	availableShapeTypes,
	availableShapeNames,
}) => {
	// Map options for Shadcn Select
	const keyOptions = availableKeys.map((key) => ({ value: key, label: key }));
	const shapeTypeOptions = availableShapeTypes.map((type) => ({
		value: type,
		label: type.charAt(0).toUpperCase() + type.slice(1),
	}));
	const shapeNameOptions = availableShapeNames.map((name) => ({ value: name, label: name }));

	return (
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
			</div>
		</div>
	);
};

export default Controls;
