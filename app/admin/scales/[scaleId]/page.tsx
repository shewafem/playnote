// app/admin/scales/[scaleId]/page.tsx
import { getScaleById, updateScale } from "@/app/admin/scales/actions";
import { notFound } from "next/navigation";
import { ScaleForm } from "@/components/admin/scale-form";
import { ScaleFormData, formatFormulaForInput } from "@/schemas/scale";

export default async function EditScalePage({ params }: { params: { scaleId: string } }) {
	const scaleIdNum = Number(params.scaleId);

	if (isNaN(scaleIdNum)) {
		notFound();
	}

	const scale = await getScaleById(scaleIdNum);

	if (!scale) {
		notFound();
	}

	const defaultFormValues: ScaleFormData = {
		name: scale.name,
		formula: formatFormulaForInput(scale.formula),
	};

	const handleUpdate = async (data: ScaleFormData) => {
		"use server";
		return updateScale(scaleIdNum, data);
	};

	return (
		<ScaleForm
			defaultValues={defaultFormValues}
			onSubmit={handleUpdate}
			isEditing
			formTitle={`Редактировать лад: ${scale.name}`}
			formDescription="Измените название или формулу лада."
		/>
	);
}