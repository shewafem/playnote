import ResetPasswordForm from "@/components/auth/reset-password-form";
import { Suspense } from "react";

export default function ResetPasswordPage() {
	return (
		<div className="flex flex-col items-center justify-center p-6">
			<div className="w-full max-w-md">
				<Suspense fallback={<div>Загрузка...</div>}>
					<ResetPasswordForm />
				</Suspense>
			</div>
		</div>
	);
}
