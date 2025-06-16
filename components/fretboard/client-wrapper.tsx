// components/interactive-fretboard/client-wrapper.tsx
"use client";

import React, { useEffect, useRef } from "react"; // Added useRef
import { useFretboardStore } from "@/lib/fretboard-store";
import InteractiveFretboard from "./index";
import type { ShapesObjectType, TuningsMidiObjectType } from "@/lib/fretboard-utils";
import { NOTE_NAMES } from "@/lib/fretboard-utils";
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
	} = useFretboardStore();

	const searchParams = useSearchParams();
	const initialDataLoadedRef = useRef(false);

	useEffect(() => {
		if (
			!initialShapes ||
			!initialTunings ||
			Object.keys(initialShapes).length === 0 ||
			Object.keys(initialTunings).length === 0
		) {
			console.log("ClientWrapper: initialShapes or initialTunings not ready yet.");
			return;
		}

		setAllShapes(initialShapes);
		setAllTunings(initialTunings);
		initialDataLoadedRef.current = true;

		console.log("ClientWrapper: setAllShapes and setAllTunings called.");
	}, [initialShapes, initialTunings, setAllShapes, setAllTunings]);

	useEffect(() => {
		if (
			!initialDataLoadedRef.current ||
			!initialShapes ||
			!initialTunings ||
			Object.keys(initialShapes).length === 0 ||
			Object.keys(initialTunings).length === 0
		) {
			return;
		}

		const keyFromUrl = searchParams.get("key");
		if (keyFromUrl && NOTE_NAMES.includes(keyFromUrl)) {
			setSelectedKey(keyFromUrl);
		} else if (!searchParams.has("key")) {
			setSelectedKey(NOTE_NAMES[0]);
		}

		const startFretFromUrl = searchParams.get("startFret");
		if (startFretFromUrl) {
			const num = parseInt(startFretFromUrl, 10);
			if (!isNaN(num)) setStartFret(num);
		} else if (!searchParams.has("startFret")) {
			setStartFret(0);
		}

		const endFretFromUrl = searchParams.get("endFret");
		if (endFretFromUrl) {
			const num = parseInt(endFretFromUrl, 10);
			if (!isNaN(num)) setEndFret(num);
		} else if (!searchParams.has("endFret")) {
			setEndFret(12);
		}
		const typeFromUrl = searchParams.get("type");
		const availableShapeTypes = Object.keys(initialShapes);
		let determinedShapeType = "";

		if (typeFromUrl && availableShapeTypes.includes(typeFromUrl)) {
			determinedShapeType = typeFromUrl;
		} else if (!searchParams.has("type") && availableShapeTypes.length > 0) {
			determinedShapeType = availableShapeTypes[0];
		}
		if (determinedShapeType) {
			setSelectedShapeType(determinedShapeType);
		} else if (availableShapeTypes.length === 0 && !searchParams.has("type")) {
			setSelectedShapeType("");
		}

		const nameFromUrl = searchParams.get("name");
		const currentShapeTypeForNameLogic = determinedShapeType || useFretboardStore.getState().selectedShapeType;
		const availableShapeNames = Object.keys(initialShapes[currentShapeTypeForNameLogic] || {});
		let determinedShapeName = "";

		if (nameFromUrl && availableShapeNames.includes(nameFromUrl)) {
			determinedShapeName = nameFromUrl;
		} else if (!searchParams.has("name") && availableShapeNames.length > 0) {
			determinedShapeName = availableShapeNames[0];
		}
		if (determinedShapeName) {
			setSelectedShapeName(determinedShapeName);
		} else if (availableShapeNames.length === 0 && !searchParams.has("name")) {
			setSelectedShapeName("");
		}

		const tuningFromUrl = searchParams.get("tuning");
		const availableTuningNames = Object.keys(initialTunings);
		let determinedTuning = "";

		if (tuningFromUrl && availableTuningNames.includes(tuningFromUrl)) {
			determinedTuning = tuningFromUrl;
		} else if (!searchParams.has("tuning") && availableTuningNames.length > 0) {
			determinedTuning = availableTuningNames[0];
		}
		if (determinedTuning) {
			setSelectedTuning(determinedTuning);
		} else if (availableTuningNames.length === 0 && !searchParams.has("tuning")) {
			setSelectedTuning("");
		}
	}, [
		searchParams,
		initialShapes,
		initialTunings,
		setAllShapes,
		setAllTunings,
		setSelectedKey,
		setSelectedShapeType,
		setSelectedShapeName,
		setSelectedTuning,
		setStartFret,
		setEndFret,
	]);

	return <InteractiveFretboard />;
};

export default InteractiveFretboardClientWrapper;
