import { createArpeggio } from "@/app/admin/arpeggios/actions";
import { ArpeggioForm } from "@/components/admin/arpeggio-form";
import { ArpeggioFormData } from "@/schemas/arpeggio";

export default function AddArpeggioPage() {
	const handleCreate = async (data: ArpeggioFormData) => {
		"use server";
		return createArpeggio(data);
	};

	return (
		<ArpeggioForm
			onSubmit={handleCreate}
			isEditing={false}
			formTitle="Создать новое арпеджио"
			formDescription="Добавьте новое арпеджио, указав его название и формулу."
		/>
	);
}