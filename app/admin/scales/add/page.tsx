// app/admin/scales/add/page.tsx
import { createScale } from "@/app/admin/scales/actions";
import { ScaleForm } from "@/components/admin/scale-form";
import { ScaleFormData } from "@/schemas/scale";

export default function AddScalePage() {
	const handleCreate = async (data: ScaleFormData) => {
		"use server";
		return createScale(data);
	};

	return (
		<ScaleForm
			onSubmit={handleCreate}
			isEditing={false}
			formTitle="Создать новую гамму"
			formDescription="Добавьте новую гамму, указав его название и формулу."
		/>
	);
}