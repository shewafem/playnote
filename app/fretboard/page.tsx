import InteractiveFretboardClientWrapper from "@/components/fretboard/client-wrapper";
import { NoteValue, ShapesObjectType, transformNotesToMidi, TuningsMidiObjectType } from "@/lib/fretboard-utils";
import prisma from "@/lib/prisma";
import { Suspense } from "react";
import FretboardLoading from "./loading";

async function getFretboardInitialData() {
	const dbScales = await prisma.scale.findMany();
	const dbArpeggios = await prisma.arpeggio.findMany();
	const dbTunings = await prisma.tuning.findMany();

	const initialShapes: ShapesObjectType = {
		Гаммы: {},
		Арпеджио: {},
	};

	dbScales.forEach((scale) => {
		initialShapes["Гаммы"][scale.name] = scale.formula as NoteValue[];
	});

	dbArpeggios.forEach((arpeggio) => {
		initialShapes["Арпеджио"][arpeggio.name] = arpeggio.formula as NoteValue[];
	});

	const initialTunings: TuningsMidiObjectType = {};
	dbTunings.forEach((tuning) => {
		initialTunings[tuning.name] = transformNotesToMidi(tuning.notes);
	});

	return { initialShapes, initialTunings };
}

export default async function FretboardPage() {
	const { initialShapes, initialTunings } = await getFretboardInitialData();

	return (
		<Suspense fallback={<FretboardLoading />}>
			<InteractiveFretboardClientWrapper initialShapes={initialShapes} initialTunings={initialTunings} />
		</Suspense>
	);
}
