import { TuningFormInput, TuningFormShape } from "@/schemas/tuning";
import { getTuningById, updateTuning } from "@/app/admin/tunings/actions";
import { notFound } from "next/navigation";
import { TuningForm } from "@/components/admin/tuning-form";

export default async function EditTuningPage({ params }: { params: Promise<{ tuningId: string }> }) {
	const { tuningId } = await params;
	const tuningIdNum = Number(tuningId);

	if (isNaN(tuningIdNum)) {
		notFound();
	}

	const tuning = await getTuningById(tuningIdNum);

	if (!tuning) {
		notFound();
	}

	const defaultFormShapeValues: TuningFormShape = {
		name: tuning.name,
		notes: tuning.notes.map((noteStr) => {
			const match = noteStr.match(/^([A-Ga-g][#b]?)([1-6])$/);
      console.log(match)
			if (match) {
				return { note: match[1], octave: match[2] };
			}
			return { note: "E", octave: "4" };
		}),
	};

	const handleUpdate = async (data: TuningFormInput) => {
		"use server";
		return updateTuning(tuningIdNum, data);
	};

	return (
		<TuningForm
			defaultValues={defaultFormShapeValues}
			onSubmit={handleUpdate}
			isEditing
			formTitle={`Редактировать тюнинг: ${tuning.name}`}
			formDescription="Измените название и ноты для каждой струны."
		/>
	);
}
