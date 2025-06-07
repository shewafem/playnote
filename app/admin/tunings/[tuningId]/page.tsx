import { TuningFormInput } from "@/schemas/tuning"; // For defaultValues type
import { getTuningById, updateTuning } from "../actions";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TuningForm } from "@/components/admin/tuning-form";

export default async function EditTuningPage({ params }: { params: Promise<{ tuningId: string }> }) {
	const{ tuningId } = await params
  const tuningIdNum = Number(tuningId);
	// ... error handling for tuningId ...
	const tuning = await getTuningById(tuningIdNum); // Action to fetch tuning

	if (!tuning) notFound();

	const defaultValues: TuningFormInput = {
		name: tuning.name,
		notes: tuning.notes.join(", "), // Convert array to string for form
	};

	const handleUpdate = async (data: TuningFormInput) => {
		"use server";
		return updateTuning(tuningIdNum, data);
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Редактировать строй: {tuning.name}</CardTitle>
			</CardHeader>
			<CardContent>
				<TuningForm defaultValues={defaultValues} onSubmit={handleUpdate} isEditing />
			</CardContent>
		</Card>
	);
}
