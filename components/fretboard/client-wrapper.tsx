// components/interactive-fretboard/client-wrapper.tsx
"use client";

import React, { useEffect, useRef } from "react";
import { useFretboardStore } from "@/lib/fretboard-store";
import InteractiveFretboard from "./index";
import type { ShapesObjectType, TuningsMidiObjectType } from "@/lib/fretboard-utils";
import { NOTE_NAMES } from "@/lib/fretboard-utils"; // For key validation
import { useSearchParams } from "next/navigation";

interface ClientWrapperProps {
	initialShapes: ShapesObjectType;
	initialTunings: TuningsMidiObjectType;
}

const InteractiveFretboardClientWrapper: React.FC<ClientWrapperProps> = ({ initialShapes, initialTunings }) => {
	const {
		setAllShapes,
		setAllTunings,
		setSelectedKey,
		setSelectedShapeType,
		setSelectedShapeName,
		setSelectedTuning,
		setStartFret,
		setEndFret,
		selectedKey: currentKey,
		selectedShapeType: currentType,
		selectedShapeName: currentName,
		selectedTuning: currentTuningName,
		startFret: currentStartFret,
		endFret: currentEndFret,
	} = useFretboardStore();

	const searchParams = useSearchParams();
	const initializedRef = useRef(false);

	useEffect(() => {
		if (initializedRef.current || !initialShapes || !initialTunings) return;

		setAllShapes(initialShapes);
		setAllTunings(initialTunings);

		const keyFromUrl = searchParams.get("key");
		if (keyFromUrl && NOTE_NAMES.includes(keyFromUrl)) {
			setSelectedKey(keyFromUrl);
		} else {
			setSelectedKey(currentKey);
		}

		const startFretFromUrl = searchParams.get("startFret");
		if (startFretFromUrl) {
			const num = parseInt(startFretFromUrl, 10);
			if (!isNaN(num)) setStartFret(num);
		} else {
			setStartFret(currentStartFret);
		}

		const endFretFromUrl = searchParams.get("endFret");
		if (endFretFromUrl) {
			const num = parseInt(endFretFromUrl, 10);
			if (!isNaN(num)) setEndFret(num); 
		} else {
			setEndFret(currentEndFret);
		}

		const availableShapeTypes = Object.keys(initialShapes);
		let finalShapeType = currentType; 
		const typeFromUrl = searchParams.get("type");

		if (typeFromUrl && availableShapeTypes.includes(typeFromUrl)) {
			finalShapeType = typeFromUrl;
		} else if (!availableShapeTypes.includes(finalShapeType) && availableShapeTypes.length > 0) {
			finalShapeType = availableShapeTypes[0];
		} else if (availableShapeTypes.length === 0) {
			finalShapeType = ""; 
		}
		setSelectedShapeType(finalShapeType);

		const availableShapeNamesForFinalType = Object.keys(initialShapes[finalShapeType] || {});
		let finalShapeName = currentName;
		const nameFromUrl = searchParams.get("name");

		if (nameFromUrl && availableShapeNamesForFinalType.includes(nameFromUrl)) {
			finalShapeName = nameFromUrl;
		} else if (
			!availableShapeNamesForFinalType.includes(finalShapeName) &&
			availableShapeNamesForFinalType.length > 0
		) {
			finalShapeName = availableShapeNamesForFinalType[0];
		} else if (availableShapeNamesForFinalType.length === 0) {
			finalShapeName = "";
		}
		setSelectedShapeName(finalShapeName);

		const availableTuningNames = Object.keys(initialTunings);
		let finalTuning = currentTuningName;
		const tuningFromUrl = searchParams.get("tuning");

		if (tuningFromUrl && availableTuningNames.includes(tuningFromUrl)) {
			finalTuning = tuningFromUrl;
		} else if (!availableTuningNames.includes(finalTuning) && availableTuningNames.length > 0) {
			finalTuning = availableTuningNames[0];
		} else if (availableTuningNames.length === 0) {
			finalTuning = "";
		}
		setSelectedTuning(finalTuning);

		initializedRef.current = true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initialShapes, initialTunings, searchParams]);

	return <InteractiveFretboard />;
};

export default InteractiveFretboardClientWrapper;
