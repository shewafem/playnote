import LoginForm from "@/components/auth/login-form";
import Logo from "@/components/ui/logo";

export default function LoginPage() {
	return (
		<div className="bg-background flex flex-col items-center justify-center">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<Logo className="" size={28} />
				<LoginForm />
			</div>
		</div>
	);
}
