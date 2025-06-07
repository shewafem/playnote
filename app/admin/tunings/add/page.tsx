import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TuningForm } from "@/components/admin/tuning-form";
import { createTuning } from "../actions";

export default function NewUserPage() {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-center">Добавить новый строй</CardTitle>
			</CardHeader>
			<CardContent>
				<TuningForm onSubmit={createTuning} />
			</CardContent>
		</Card>
	);
}
