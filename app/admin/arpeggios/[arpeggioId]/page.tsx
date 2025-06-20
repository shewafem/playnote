import { getArpeggioById, updateArpeggio } from "@/app/admin/arpeggios/actions";
import { notFound } from "next/navigation";
import { ArpeggioForm } from "@/components/admin/arpeggio-form";
import { ArpeggioFormData, formatFormulaForInput } from "@/schemas/arpeggio";

export default async function EditArpeggioPage({ params }: { params: Promise<{ arpeggioId: string }> }) {
	const {arpeggioId} = await params;
  const arpeggioIdNum = Number(arpeggioId)

	if (isNaN(arpeggioIdNum)) {
		notFound();
	}

	const arpeggio = await getArpeggioById(arpeggioIdNum);

	if (!arpeggio) {
		notFound();
	}

	const defaultFormValues: ArpeggioFormData = {
		name: arpeggio.name,
		formula: formatFormulaForInput(arpeggio.formula),
	};

	const handleUpdate = async (data: ArpeggioFormData) => {
		"use server";
		return updateArpeggio(arpeggioIdNum, data);
	};

	return (
		<ArpeggioForm
			defaultValues={defaultFormValues}
			onSubmit={handleUpdate}
			isEditing
			formTitle={`Редактировать арпеджио: ${arpeggio.name}`}
			formDescription="Измените название или формулу арпеджио."
		/>
	);
}