import ForgotPasswordForm from "@/components/auth/forgot-password-form";
import { Suspense } from "react";

export default function ForgotPasswordPage() {
	return (
		<div className="flex flex-col items-center justify-center p-6">
			<div className="w-full max-w-md">
				<h1 className="text-2xl font-semibold text-center mb-6">Забыли пароль?</h1>
				<p className="text-muted-foreground text-center mb-6">
					Введите свой email, и мы отправим вам ссылку для сброса пароля.
				</p>
				<Suspense fallback={<div>Загрузка формы...</div>}>
					<ForgotPasswordForm />
				</Suspense>
			</div>
		</div>
	);
}
